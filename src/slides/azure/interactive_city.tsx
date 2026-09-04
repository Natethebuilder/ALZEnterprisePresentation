import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AZSlide, Kicker, useIsLiveSlide } from './components';
import { CityScene } from './city3d/CityScene';
import { NODES, SCENARIOS } from './city3d/scenarios';
import { ArrowLeft, ArrowRight, RotateCcw, MousePointerClick, Check, X, Crosshair } from 'lucide-react';

/** How long the packet takes to fly one leg, once the presenter clicks. */
const TRAVEL_MS = 1100;

/**
 * The interactive city walkthrough.
 *
 * Nothing here advances on its own. The packet moves exactly once per click,
 * along exactly one leg, and then stops, so the slide can be talked over at
 * whatever pace the room needs. You can step with the buttons, jump to any hop
 * in the strip, or click a marker in the city itself.
 */
export function SlideCityWalkthrough() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const scenario = SCENARIOS.find((s) => s.id === scenarioId)!;
  const hops = scenario.hops;

  const [rawStep, setStep] = useState(0);
  const [travelling, setTravelling] = useState(false);
  const [lockOnPacket, setLockOnPacket] = useState(false);
  const progressRef = useRef(0);
  const rafRef = useRef<number>();

  // Switching to a shorter scenario would otherwise index past the end for one
  // render, before the reset effect runs. Clamp on the way out instead.
  const step = Math.min(rawStep, hops.length - 1);

  const live = useIsLiveSlide();
  const current = hops[step];
  const denied = current.status === 'deny';

  const stopAnimation = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = undefined;
  }, []);

  /** Fly the packet along one leg, then hand control straight back. */
  const flyTo = useCallback(
    (target: number) => {
      stopAnimation();
      progressRef.current = 0;
      setTravelling(true);
      setStep(target);

      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / TRAVEL_MS);
        // easeInOutCubic leaves and arrives calmly, moving quickly in between.
        progressRef.current = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          rafRef.current = undefined;
          setTravelling(false);
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    },
    [stopAnimation]
  );

  /** Jump without animating, used for going back and for big jumps. */
  const jumpTo = useCallback(
    (target: number) => {
      stopAnimation();
      progressRef.current = 0;
      setTravelling(false);
      setStep(target);
    },
    [stopAnimation]
  );

  const goTo = useCallback(
    (target: number) => {
      const clamped = Math.max(0, Math.min(hops.length - 1, target));
      if (clamped === step) return;
      // Only a single step forward is worth animating; anything else would
      // fly the packet along a leg the audience is not looking at.
      if (clamped === step + 1) flyTo(clamped);
      else jumpTo(clamped);
    },
    [flyTo, jumpTo, hops.length, step]
  );

  const next = useCallback(() => goTo(step + 1), [goTo, step]);
  const prev = useCallback(() => goTo(step - 1), [goTo, step]);
  const restart = useCallback(() => jumpTo(0), [jumpTo]);

  // Reset when the scenario changes.
  useEffect(() => {
    jumpTo(0);
  }, [scenarioId, jumpTo]);

  useEffect(() => stopAnimation, [stopAnimation]);

  // Space / Backspace step the walkthrough while this slide is the live one.
  // Captured and stopped so they never reach the deck's own navigation.
  useEffect(() => {
    if (!live) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        next();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        e.stopPropagation();
        prev();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [live, next, prev]);

  return (
    <AZSlide index={11} kicker="Interactive">
      <div className="absolute inset-0 px-16 pt-28 pb-20 flex gap-8">
        {/* ------------------------------------------------------ City --- */}
        <div className="flex-1 relative rounded border-2 border-slide-gray-200 overflow-hidden bg-white">
          <div className="absolute inset-0">
            {live ? (
              <CityScene
                hops={hops}
                step={step}
                progressRef={progressRef}
                travelling={travelling}
                onSelectHop={goTo}
                lockOnPacket={lockOnPacket}
              />
            ) : (
              // Thumbnails and the overview grid must never start a WebGL
              // context; there can be twenty of them on screen at once.
              <div className="w-full h-full grid place-items-center bg-slide-gray-100">
                <span className="text-2xl font-semibold text-slide-gray-500">
                  Interactive 3D city
                </span>
              </div>
            )}
          </div>

          <div className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-sm bg-white/92 border-2 border-slide-gray-200 text-base font-medium text-slide-gray-700">
            <MousePointerClick className="w-4 h-4 text-slide-accent" />
            Click a marker to jump there · drag to orbit · scroll to zoom
          </div>

          <button
            type="button"
            onClick={() => setLockOnPacket((locked) => !locked)}
            aria-pressed={lockOnPacket}
            className={`absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-sm border-2 text-base font-semibold transition-colors ${
              lockOnPacket
                ? 'bg-slide-primary border-slide-primary text-white'
                : 'bg-white/92 border-slide-gray-200 text-slide-gray-700 hover:border-slide-accent hover:text-slide-accent'
            }`}
          >
            <Crosshair className="w-4 h-4" />
            {lockOnPacket ? 'Explore city' : 'Lock on packet'}
          </button>

          <div className="absolute bottom-4 left-4 px-4 py-2 rounded-sm bg-white/92 border-2 border-slide-gray-200 text-base font-medium text-slide-gray-700">
            {scenario.summary}
          </div>
        </div>

        {/* --------------------------------------------------- Panel ----- */}
        <div className="w-[640px] flex flex-col">
          <Kicker>Walk the city</Kicker>
          <h2 className="font-display text-4xl font-semibold tracking-tight leading-[1.08]">
            Follow one packet, one hop at a time.
          </h2>

          {/* Scenario picker */}
          <div className="mt-5 grid grid-cols-2 gap-2">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setScenarioId(s.id)}
                className={`text-left px-4 py-2.5 rounded-sm border-2 text-lg font-semibold leading-tight transition-colors ${
                  s.id === scenarioId
                    ? 'bg-slide-primary border-slide-primary text-white'
                    : 'bg-white border-slide-gray-300 text-slide-gray-700 hover:border-slide-accent hover:text-slide-accent'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Step controls, the only thing that moves the packet */}
          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={prev}
              disabled={step === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-slide-gray-300 text-slide-gray-700 text-lg font-semibold disabled:opacity-35 hover:border-slide-accent hover:text-slide-accent transition-colors"
            >
              <ArrowLeft className="w-5 h-5" /> Back
            </button>
            <button
              type="button"
              onClick={next}
              disabled={step >= hops.length - 1}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-slide-accent text-white text-lg font-semibold disabled:opacity-35 hover:bg-slide-primary-light transition-colors"
            >
              Next hop <ArrowRight className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={restart}
              disabled={step === 0}
              title="Back to the start"
              className="p-2.5 rounded-full border-2 border-slide-gray-300 text-slide-gray-600 disabled:opacity-35 hover:border-slide-accent hover:text-slide-accent transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <span className="ml-auto text-lg font-mono tabular-nums text-slide-gray-500">
              {step + 1} / {hops.length}
            </span>
          </div>

          {/* The hop being discussed */}
          <div
            className={`mt-4 shrink-0 rounded-sm border-2 px-6 py-4 h-[368px] flex flex-col overflow-hidden transition-colors ${
              denied
                ? 'bg-[hsl(var(--slide-error)/0.07)] border-[hsl(var(--slide-error)/0.55)]'
                : 'bg-slide-accent-muted border-slide-accent'
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-7 h-7 rounded-sm grid place-items-center ${
                  denied ? 'bg-[hsl(var(--slide-error))]' : 'bg-slide-accent'
                } text-white`}
              >
                {denied ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
              </span>
              <span className="text-lg font-semibold uppercase tracking-[0.14em] text-slide-gray-600">
                {NODES[current.node].azure}
              </span>
            </div>

            <div className="mt-2.5 font-display text-3xl font-semibold text-slide-gray-900 leading-tight">
              {current.title}
            </div>
            <p className="mt-2.5 text-2xl text-slide-gray-700 leading-snug">{current.plain}</p>
            <p className="mt-2.5 text-lg text-slide-gray-600 leading-snug">{current.azure}</p>
            <div className="mt-auto pt-3.5">
              <span className="inline-block rounded-sm bg-white border-2 border-slide-gray-200 px-4 py-1.5 font-mono text-base text-slide-primary">
                {current.control}
              </span>
            </div>
          </div>

          {/* Hop stepper, click any hop to jump straight to it */}
          <div className="mt-5 flex items-center">
            {hops.map((h, i) => (
              <React.Fragment key={h.title + i}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  title={h.title}
                  aria-label={`${i + 1}. ${h.title}`}
                  className="group relative shrink-0"
                >
                  <span
                    className={`block w-10 h-10 rounded-sm grid place-items-center text-xl font-semibold transition-all ${
                      h.status === 'deny' && i <= step
                        ? 'bg-[hsl(var(--slide-error))] text-white'
                        : i < step
                        ? 'bg-slide-primary text-white'
                        : i === step
                        ? 'bg-slide-accent text-white ring-4 ring-slide-accent/25'
                        : 'bg-slide-gray-200 text-slide-gray-600 hover:bg-slide-gray-300'
                    }`}
                  >
                    {i + 1}
                  </span>
                </button>
                {i < hops.length - 1 && (
                  <span
                    className={`h-1 flex-1 mx-1.5 rounded-full transition-colors ${
                      i < step ? 'bg-slide-primary' : 'bg-slide-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          <p className="mt-auto pt-4 text-lg text-slide-gray-500 whitespace-nowrap">
            Space / Backspace step · ← → change slide
          </p>
        </div>
      </div>
    </AZSlide>
  );
}
