import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls, useGLTF, ContactShadows } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import packetUrl from '@/assets/models/ms-packet.glb?url';
import cityUrl from '@/assets/models/low-poly-city.glb?url';
import { NODES, type CityNode, type Hop } from './scenarios';
import { cityPalette, type CityPalette } from './tokens';

/*
 * The city is the uploaded low-poly model, full stop; there is no procedural
 * geometry standing in for buildings, roads or districts any more.
 *
 * Azure concepts are drawn as a deliberate overlay *above* the model: a ground
 * ring and a vertical beam locate each component in the city, an arced route
 * carries the packet between them, and the Microsoft Store packet model is the
 * thing that travels. Only the nodes belonging to the active scenario are ever
 * drawn, so the scene stays as quiet as the story being told.
 */

/** How wide the city model is scaled to, in world units. */
const CITY_FOOTPRINT = 52;
/** Keep the route in a visible air lane above the imported city. */
const ROUTE_LIFT = 0.28;

useGLTF.preload(cityUrl);
useGLTF.preload(packetUrl);

/* ============================================================== City ==== */

interface CityFit {
  object: THREE.Object3D;
  /** Height of the tallest thing in the city, in world units. */
  height: number;
}

/**
 * Fits the city model to the scene.
 *
 * The model's own bounding box is not usable directly: it includes a very
 * large ground/water plate that is offset well outside the built-up area, so
 * centring on it pushes the actual town into a corner. Instead we measure
 * every mesh, throw away the handful whose footprint covers most of the model
 * (the plates), and frame what is left, the town.
 */
function useCityModel(): CityFit {
  const { scene } = useGLTF(cityUrl);

  return useMemo(() => {
    const object = scene.clone(true);
    object.updateMatrixWorld(true);

    const full = new THREE.Box3().setFromObject(object);
    const fullSize = new THREE.Vector3();
    full.getSize(fullSize);
    const fullArea = Math.max(fullSize.x * fullSize.z, 1e-6);

    // Union of every mesh that is not a ground plate.
    const town = new THREE.Box3();
    const meshBox = new THREE.Box3();
    object.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;

      mesh.castShadow = false;
      mesh.receiveShadow = true;
      // The overlay must always win the depth fight against city geometry.
      mesh.renderOrder = 0;

      meshBox.setFromObject(mesh);
      if (meshBox.isEmpty()) return;
      const w = meshBox.max.x - meshBox.min.x;
      const d = meshBox.max.z - meshBox.min.z;
      // A single mesh covering a third of the model is scenery, not a building.
      if ((w * d) / fullArea > 0.3) return;
      town.union(meshBox);
    });

    const source = town.isEmpty() ? full : town;
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    source.getSize(size);
    source.getCenter(center);

    const k = CITY_FOOTPRINT / Math.max(size.x, size.z, 1e-6);
    object.scale.setScalar(k);
    // Centre on the town horizontally, and sit the whole model on y = 0.
    object.position.set(-center.x * k, -full.min.y * k, -center.z * k);

    return { object, height: THREE.MathUtils.clamp(size.y * k, 3, 14) };
  }, [scene]);
}

function CityModel({ fit }: { fit: CityFit }) {
  return <primitive object={fit.object} />;
}

/* ============================================================ Route ===== */

/** A gently arced path from one node to the next, flown above the rooftops. */
function legCurve(from: CityNode, to: CityNode, lift: number) {
  const a = new THREE.Vector3(from.pos[0], lift, from.pos[2]);
  const b = new THREE.Vector3(to.pos[0], lift, to.pos[2]);
  const mid = a.clone().lerp(b, 0.5);
  // Arc height scales with distance so short hops stay flat and long hops soar.
  mid.y = lift + Math.min(9, a.distanceTo(b) * 0.28);
  return new THREE.QuadraticBezierCurve3(a, mid, b);
}

function RouteLeg({
  curve,
  color,
  opacity,
  radius,
  dashed,
}: {
  curve: THREE.Curve<THREE.Vector3>;
  color: string;
  opacity: number;
  radius: number;
  dashed?: boolean;
}) {
  const geometry = useMemo(
    () => new THREE.TubeGeometry(curve, 48, radius, 8, false),
    [curve, radius]
  );
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry} renderOrder={2}>
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        wireframe={dashed}
      />
    </mesh>
  );
}

/* =========================================================== Marker ===== */

type MarkerState = 'past' | 'active' | 'future' | 'denied';

function Marker({
  node,
  state,
  beamHeight,
  palette,
  onSelect,
}: {
  node: CityNode;
  state: MarkerState;
  beamHeight: number;
  palette: CityPalette;
  onSelect?: () => void;
}) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const active = state === 'active' || state === 'denied';

  const color =
    state === 'denied'
      ? palette.error
      : state === 'active'
      ? palette.accent
      : state === 'past'
      ? palette.navy
      : palette.dim;

  const opacity = state === 'future' ? 0.35 : 1;

  // A single expanding ring on the active marker. Nothing else moves on its
  // own; the presenter drives every other change in the scene.
  useFrame(({ clock }) => {
    if (!pulseRef.current) return;
    if (!active) {
      pulseRef.current.visible = false;
      return;
    }
    pulseRef.current.visible = true;
    const t = (clock.elapsedTime % 2) / 2;
    const s = 1 + t * 2.4;
    pulseRef.current.scale.set(s, s, s);
    (pulseRef.current.material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.55;
  });

  return (
    <group
      position={[node.pos[0], 0, node.pos[2]]}
      onClick={
        onSelect
          ? (e) => {
              e.stopPropagation();
              onSelect();
            }
          : undefined
      }
      onPointerOver={onSelect ? () => (document.body.style.cursor = 'pointer') : undefined}
      onPointerOut={onSelect ? () => (document.body.style.cursor = 'auto') : undefined}
    >
      {/* Ground ring locating the component in the city */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]} renderOrder={3}>
        <ringGeometry args={[0.85, 1.05, 48]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
      </mesh>

      {/* Soft disc so the ring reads against busy rooftops */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} renderOrder={3}>
        <circleGeometry args={[0.85, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity * (active ? 0.28 : 0.12)}
          depthWrite={false}
        />
      </mesh>

      {/* Pulse on the active marker only */}
      <mesh ref={pulseRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]} renderOrder={3}>
        <ringGeometry args={[0.9, 1.05, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Vertical beam tying the ground marker to the route above */}
      <mesh position={[0, beamHeight / 2, 0]} renderOrder={3}>
        <cylinderGeometry args={[0.06, 0.06, beamHeight, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity * (active ? 0.9 : 0.5)}
          depthWrite={false}
        />
      </mesh>

      {/* Label pill, floating clear of the tallest rooftop */}
      <Html
        center
        position={[0, beamHeight + 1.1, 0]}
        zIndexRange={[8, 0]}
        style={{ pointerEvents: 'none' }}
      >
        <div className="whitespace-nowrap text-center select-none" style={{ opacity }}>
          <div
            className={[
              'px-3 py-1 rounded-sm border-2 text-[13px] font-semibold shadow-sm',
              state === 'denied'
                ? 'bg-[hsl(var(--slide-error))] border-[hsl(var(--slide-error))] text-white'
                : state === 'active'
                ? 'bg-slide-accent border-slide-accent text-white'
                : state === 'past'
                ? 'bg-slide-primary border-slide-primary text-white'
                : 'bg-white border-slide-gray-400 text-slide-gray-700',
            ].join(' ')}
          >
            {node.label}
          </div>
          {state !== 'future' && (
            <div className="mt-1 text-[11px] font-medium text-slide-gray-700 bg-white/90 rounded-sm px-1.5 py-0.5 shadow-sm">
              {node.azure}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

/* =========================================================== Packet ===== */

function PacketModel({ color }: { color: string }) {
  const { scene } = useGLTF(packetUrl);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const target = 1.05;
    const k = target / Math.max(size.x, size.y, size.z || 1);
    clone.scale.setScalar(k);
    clone.position.set(-center.x * k, -center.y * k, -center.z * k);
    clone.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) mesh.castShadow = true;
    });
    return clone;
  }, [scene]);

  return (
    <group>
      <primitive object={model} />
      <pointLight color={color} intensity={2.4} distance={8} />
      <mesh renderOrder={4} scale={1.35}>
        <sphereGeometry args={[0.72, 24, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.16}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Status halo so allow / deny is readable from the back of a room */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.67, 0]} renderOrder={5}>
        <circleGeometry args={[0.72, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} depthWrite={false} />
      </mesh>
    </group>
  );
}

/**
 * Carries the packet along the current leg.
 *
 * `progressRef` is written by the slide, once per click; the packet never
 * moves unless the presenter moved it.
 */
function Packet({
  curve,
  progressRef,
  restPoint,
  color,
  positionRef,
}: {
  curve: THREE.Curve<THREE.Vector3> | null;
  progressRef: React.MutableRefObject<number>;
  restPoint: THREE.Vector3;
  color: string;
  positionRef: React.MutableRefObject<THREE.Vector3>;
}) {
  const ref = useRef<THREE.Group>(null);
  const scratch = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const t = THREE.MathUtils.clamp(progressRef.current, 0, 1);
    if (curve) {
      curve.getPointAt(t, scratch);
      ref.current.position.copy(scratch);
    } else {
      ref.current.position.copy(restPoint);
    }
    positionRef.current.copy(ref.current.position);
    // A slow spin so the model reads as three-dimensional while parked.
    ref.current.rotation.y += delta * 0.9;
  });

  return (
    <group ref={ref}>
      <React.Suspense fallback={null}>
        <PacketModel color={color} />
      </React.Suspense>
    </group>
  );
}

/** A lightweight signal used for DNS preflight so the packet itself stays at the source. */
function LookupSignal({
  curve,
  progressRef,
  color,
}: {
  curve: THREE.Curve<THREE.Vector3> | null;
  progressRef: React.MutableRefObject<number>;
  color: string;
}) {
  const ref = useRef<THREE.Group>(null);
  const scratch = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (!ref.current || !curve) return;
    curve.getPointAt(THREE.MathUtils.clamp(progressRef.current, 0, 1), scratch);
    ref.current.position.copy(scratch);
  });

  if (!curve) return null;

  return (
    <group ref={ref}>
      <mesh renderOrder={5}>
        <sphereGeometry args={[0.36, 20, 14]} />
        <meshBasicMaterial color={color} depthWrite={false} />
      </mesh>
      <pointLight color={color} intensity={1.8} distance={6} />
    </group>
  );
}

/* =========================================================== Camera ===== */

/**
 * Eases the orbit target towards the hop being discussed, and pulls the camera
 * in a little. Any manual drag hands control back to the presenter until the
 * next step.
 */
function CameraDirector({
  focus,
  packetPosition,
  controls,
  enabled,
  lockOn,
}: {
  focus: THREE.Vector3;
  packetPosition: React.MutableRefObject<THREE.Vector3>;
  controls: React.MutableRefObject<OrbitControlsImpl | null>;
  enabled: boolean;
  lockOn: boolean;
}) {
  const desired = useRef(new THREE.Vector3());
  const desiredCamera = useRef(new THREE.Vector3());

  useEffect(() => {
    desired.current.copy(focus);
  }, [focus]);

  useFrame((_, delta) => {
    const c = controls.current;
    if (!c || !enabled) return;
    const k = 1 - Math.pow(0.001, delta);
    const target = lockOn ? packetPosition.current : desired.current;
    c.target.lerp(target, k);
    if (lockOn) {
      const direction = c.object.position.clone().sub(c.target).normalize();
      desiredCamera.current.copy(c.target).addScaledVector(direction, 29);
      c.object.position.lerp(desiredCamera.current, k);
    }
    c.update();
  });

  return null;
}

/* ============================================================ Scene ===== */

export interface CitySceneProps {
  /** The scenario's hops, in order. */
  hops: Hop[];
  /** Which hop the presenter is currently on. */
  step: number;
  /** 0 → 1 along the leg from `step - 1` to `step`, written by the slide. */
  progressRef: React.MutableRefObject<number>;
  /** True while that leg is animating. */
  travelling: boolean;
  /** Jump straight to a hop by clicking its marker in the city. */
  onSelectHop?: (index: number) => void;
  lockOnPacket?: boolean;
}

function SceneContents({ hops, step, progressRef, travelling, onSelectHop, lockOnPacket = false }: CitySceneProps) {
  const palette = useMemo(() => cityPalette(), []);
  const fit = useCityModel();
  const controls = useRef<OrbitControlsImpl | null>(null);
  const [userDriving, setUserDriving] = useState(false);
  const packetPosition = useRef(new THREE.Vector3());
  const { gl } = useThree();

  useEffect(() => {
    gl.setClearColor(new THREE.Color('#ffffff'), 1);
  }, [gl]);

  // Release the camera back to auto-framing whenever the presenter steps.
  useEffect(() => {
    setUserDriving(false);
  }, [step]);

  const beamHeight = Math.max(1.8, fit.height * 0.22);
  const routeLift = Math.max(2.4, fit.height * ROUTE_LIFT + 0.5);

  const nodes = useMemo(() => hops.map((h) => NODES[h.node]), [hops]);

  const legs = useMemo(
    () =>
      hops.map((hop, i) => {
        if (i === 0) return null;
        const from = NODES[hop.from ?? hops[i - 1].node];
        const to = NODES[hop.node];
        return { curve: legCurve(from, to, routeLift), flow: hop.flow ?? 'traffic' };
      }),
    [hops, routeLift]
  );

  // Each hop can name its own source. This keeps DNS lookup off the payload path.
  const activeRoute = travelling && step > 0 ? legs[step] ?? null : null;
  const activeLeg = activeRoute?.curve ?? null;
  const activeFlow = hops[step]?.flow ?? 'traffic';

  const restPoint = useMemo(() => {
    const hop = hops[step] ?? hops[0];
    const n = hop.flow === 'lookup' && hop.from ? NODES[hop.from] : NODES[hop.node];
    return new THREE.Vector3(n.pos[0], routeLift, n.pos[2]);
  }, [hops, step, routeLift]);

  const denied = hops[step]?.status === 'deny';
  const packetColor = denied ? palette.error : palette.accent;

  const focus = useMemo(() => {
    const n = nodes[step] ?? nodes[0];
    return new THREE.Vector3(n.pos[0], 0, n.pos[2]);
  }, [nodes, step]);

  // A node can appear more than once in a scenario; the marker takes the state
  // of whichever visit is closest to where the presenter is now.
  const markerState = (index: number): MarkerState => {
    if (index === step) return denied ? 'denied' : 'active';
    return index < step ? 'past' : 'future';
  };

  const seen = new Map<string, number>();
  nodes.forEach((n, i) => {
    const prev = seen.get(n.id);
    if (prev === undefined || Math.abs(i - step) < Math.abs(prev - step)) seen.set(n.id, i);
  });

  return (
    <>
      <color attach="background" args={['#ffffff']} />
      <fog attach="fog" args={['#ffffff', 80, 165]} />

      <ambientLight intensity={1.15} />
      <hemisphereLight args={['#ffffff', '#d8dde4', 0.7]} />
      <directionalLight position={[18, 26, 14]} intensity={1.35} />
      <directionalLight position={[-16, 12, -10]} intensity={0.35} />

      {/* The uploaded city, and nothing else standing in for it */}
      <React.Suspense fallback={null}>
        <CityModel fit={fit} />
      </React.Suspense>

      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.24}
        scale={CITY_FOOTPRINT * 1.2}
        blur={2.6}
        far={12}
        resolution={512}
      />

      {/* Route: flown legs solid, the leg in progress bright, the rest faint */}
      {legs.map((leg, i) => {
        if (!leg) return null;
        const inFlight = travelling && i === step;
        const flown = i <= step && !inFlight;
        const rejected = hops[i]?.status === 'deny' && i <= step;
        const lookup = leg.flow === 'lookup';
        return (
          <RouteLeg
            key={i}
            curve={leg.curve}
            color={
              rejected
                ? palette.error
                : inFlight
                ? palette.accent
                : flown
                ? palette.navy
                : palette.muted
            }
            opacity={inFlight ? 0.95 : flown ? (lookup ? 0.58 : 0.8) : 0.22}
            radius={lookup ? 0.08 : inFlight ? 0.26 : flown ? 0.2 : 0.1}
            dashed={lookup}
          />
        );
      })}

      {/* Markers for the active scenario only */}
      {Array.from(seen.entries()).map(([id, index]) => (
        <Marker
          key={id}
          node={NODES[id]}
          state={markerState(index)}
          beamHeight={beamHeight}
          palette={palette}
          onSelect={onSelectHop ? () => onSelectHop(index) : undefined}
        />
      ))}

      <Packet
        curve={activeFlow === 'lookup' ? null : activeLeg}
        progressRef={progressRef}
        restPoint={restPoint}
        color={packetColor}
        positionRef={packetPosition}
      />

      <LookupSignal
        curve={activeFlow === 'lookup' ? activeLeg : null}
        progressRef={progressRef}
        color={palette.accent}
      />

      <CameraDirector
        focus={focus}
        packetPosition={packetPosition}
        controls={controls}
        enabled={!userDriving || lockOnPacket}
        lockOn={lockOnPacket}
      />

      <OrbitControls
        ref={controls as never}
        makeDefault
        enablePan={false}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2.3}
        minDistance={24}
        maxDistance={110}
        enableDamping
        dampingFactor={0.08}
        onStart={() => setUserDriving(true)}
      />
    </>
  );
}

export function CityScene(props: CitySceneProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      resize={{ scroll: false, offsetSize: true }}
      camera={{ position: [0, 47, 63], fov: 40, near: 0.5, far: 400 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <React.Suspense fallback={null}>
        <SceneContents {...props} />
      </React.Suspense>
    </Canvas>
  );
}
