# Azure Landing Zones: interactive deck

A 23-slide presentation explaining Azure landing zones to a mixed room: hierarchy,
connectivity, identity and governance, with an interactive 3D city walkthrough of
network traffic at its centre.

Every concept is introduced twice: once as part of a city you already know how to
read, once in Azure terms, so a non-technical stakeholder can follow the whole arc
while an architect still gets the mechanism.

---

## Running it

Requires Node.js 20+.

```sh
npm install
npm run dev        # http://localhost:8080
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | `tsc --noEmit` against the app config |
| `npm run lint` | ESLint |
| `npm test` | Vitest, single run |

---

## Presenting

| Key | Action |
| --- | --- |
| `→` `←` `↑` `↓` | Next / previous slide |
| `Space` / `Backspace` | Step **within** an interactive slide (city walkthrough) |
| `⇧P` | Presentation mode |
| `⇧V` | Presenter view (dual window) |
| `⇧G` | Slide overview grid |
| `⇧N` | Presenter notes panel |
| `⇧S` | Toggle the sidebar |
| `Esc` | Leave presentation mode |

Nothing in the deck advances on a timer. Every build, transition and packet
movement happens because someone clicked or pressed a key.

---

## Deck structure

23 slides across four sections. Slides marked ★ have controls the presenter is
expected to click.

| # | Slide | |
| ---: | --- | --- |
| 1 | Title | |
| 2 | Platform and application landing zones | |
| 3 | Azure is a city: the metaphor map | ★ filter by section |
| 4 | § Where things live | |
| 5 | The hierarchy: five nested containers | ★ open each tier |
| 6 | § How they communicate | |
| 7 | VNet & subnets | |
| 8 | NSG vs Azure Firewall | |
| 9 | Routes & DNS | |
| 10 | Enterprise topology | ★ compare traditional hub and spoke with Virtual WAN |
| 11 | **City walkthrough (3D)** | ★ step through connection decisions |
| 12 | § Who controls what | |
| 13 | Entra ID & managed identities | |
| 14 | RBAC & scope inheritance | ★ pick a scope |
| 15 | RBAC vs Policy | |
| 16 | § Governance & operations | |
| 17 | Azure Policy effects | ★ pick an effect |
| 18 | Ownership contract | |
| 19 | Operating model | ★ three positions on the spectrum |
| 20 | Roadmap & maturity | ★ phases / maturity |
| 21 | Discovery questions | |
| 22 | Five things to remember | |
| 23 | Closing | |

Each slide makes exactly one point. Where two ideas only make sense together,
NSG and firewall, routes and DNS, policy effects and their examples, they share
a slide rather than repeating each other across two.

---

## Authoring slides

Slides are plain React components. There is no CMS and no runtime slide model:
the deck is the array in `src/slides/azure/index.ts`, in order.

```tsx
// src/slides/azure/part2_networking.tsx
import { AZSlide, Kicker, Title, Lead, Body, Box } from './components';

export function S07VNetSubnets() {
  return (
    <AZSlide index={7} kicker="VNet & Subnets">
      <Body>
        <Kicker>The private road system</Kicker>
        <Title>A VNet is a private address space.</Title>
        <Lead className="mt-5">…</Lead>
      </Body>
    </AZSlide>
  );
}
```

Then register it:

```ts
// src/slides/azure/index.ts
{ component: S07VNetSubnets, name: 'VNet & subnets', template: 'diagram' },
```

`index` on `AZSlide` is the number printed in the footer. Keep it in step with the
array order, and with `TOTAL_SLIDES` in `components.tsx`.

### Shared building blocks: `src/slides/azure/components.tsx`

| Export | Use |
| --- | --- |
| `AZSlide` | Slide chrome: Microsoft lockup, kicker, footer pager, accent rail. `tone="dark"` for section and title slides. |
| `Body` | The standard content box (`px-20 pt-28 pb-20`) |
| `Kicker` / `Title` / `Lead` | The type hierarchy |
| `Box` / `Chip` / `Legend` | Diagram primitives, tone-driven |
| `ArrowRight` / `ArrowDown` | Connectors |
| `SectionDivider` | Full-bleed section slide |
| `MicrosoftLogo` / `BrandLockup` | The four-square mark and the header lockup |
| `useStepper` / `Reveal` / `StepControls` | Click-through builds |
| `useIsLiveSlide` | True only when the slide is the one being presented, not a thumbnail |

### Geometry

Slides are authored at a fixed **1920 × 1080** and transform-scaled to fit by
`ScaledSlide`. Use absolute layout and the Tailwind type scale freely; the
`.slide-content` rules in `index.css` pin each `text-*` step to an absolute pixel
size so nothing depends on the viewport.

`useIsLiveSlide()` matters more than it looks: the sidebar and the overview grid
mount every slide at once. Anything expensive, WebGL above all, must be gated
behind it, or twenty canvases start at the same time.

---

## The 3D city walkthrough

`src/slides/azure/interactive_city.tsx` + `src/slides/azure/city3d/`

A connection trace travels through a real low-poly city model while the panel
explains each decision in both plain language and Azure terms.

### How it is put together

```
interactive_city.tsx     Slide: scenario picker, step controls, hop copy
city3d/CityScene.tsx     react-three-fiber scene
city3d/scenarios.ts      Node layout + the five scenarios and their decisions
city3d/tokens.ts         Reads the deck's CSS colour tokens into the scene
```

The city itself is the uploaded model and nothing else. There is no procedural
geometry standing in for buildings, roads or districts. Azure concepts are drawn
as a deliberate overlay above it:

- **Markers**: a ground ring, a vertical beam and a floating label, one per node.
  Only the nodes belonging to the active scenario are drawn.
- **Route**: one arced tube per leg. Flown legs are navy, the leg in progress is
  Microsoft blue, legs still ahead are faint grey, a denied leg is red.
- **Packet**: `ms-packet.glb`, carried along traffic legs. DNS lookup uses a separate dotted signal.

### Stepping

Nothing moves on its own. `flyTo()` runs a single `requestAnimationFrame` tween
over one leg and stops; `progressRef` is a ref rather than state so the tween never
re-renders React. Presenters can step with the buttons, `Space` / `Backspace`, the
numbered stepper, or by clicking a marker in the city.

The camera eases to frame the active hop, and hands control back to the presenter
the moment they drag, until the next step.

### Fitting the model

`useCityModel()` cannot use the model's own bounding box: it includes a very large
ground and water plate offset well outside the built-up area, so centring on it
pushes the town into a corner. Instead every mesh is measured, any single mesh
covering more than 30% of the model's footprint is treated as scenery and
discarded, and the union of what remains is framed. That keeps the fit correct if
the model is ever swapped for another one.

### Adding a scenario

Add an entry to `SCENARIOS` in `city3d/scenarios.ts`. Each hop names a node from
`NODES` and carries four strings: `title`, `plain` (the city), `azure` (what is
actually happening) and `control` (the concrete rule, shown as code). Set
`status: 'deny'` to colour that hop and its leg red. The scene and the panel both
follow from the data, with no component changes needed.

---

## Assets

| File | Notes |
| --- | --- |
| `src/assets/models/low-poly-city.glb` | 3.9 MB. Optimised from 63 MB with meshopt + WebP textures + simplification. Uses `EXT_meshopt_compression`, `EXT_texture_webp`, `KHR_mesh_quantization`, `EXT_mesh_gpu_instancing`. |
| `src/assets/models/ms-packet.glb` | 71 KB. The travelling packet. |

Both are imported through the bundler (`?url`) rather than served from `public/`,
so they are hashed, cached and present in the preview build.

---

## Design system

Microsoft brand colours and Fluent neutrals, defined once as HSL channels in
`src/index.css` and exposed to Tailwind in `tailwind.config.ts`.

| Token | Value | |
| --- | --- | --- |
| `--ms-blue` | `#0078D4` | Communication blue, the accent |
| `--ms-navy` | `#243A5E` | Azure navy, dark surfaces |
| `--ms-cyan` | `#50E6FF` | Azure light, accents on dark |
| `--slide-gray-*` | Fluent ramp | `#F3F2F1` → `#201F1E` |
| `--slide-success` / `-warning` / `-error` | `#107C10` / `#FFB900` / `#D13438` | Fluent semantics |
| `--ms-logo-*` | `#F25022` `#7FBA00` `#00A4EF` `#FFB900` | The four logo squares |

Type is Segoe UI, with Inter (loaded in `index.html`) as the cross-platform
fallback and Cascadia Mono for code.

The 3D scene reads these same tokens out of the DOM through
`city3d/tokens.ts`. There are no hardcoded colours in the WebGL layer, so a
palette change follows through to the city automatically.

---

## Tech

Vite · React 18 · TypeScript · Tailwind CSS · shadcn/ui · react-three-fiber +
drei + three.js · Vitest.

Supabase is wired up in `src/integrations/supabase/` and backs presenter notes;
the deck runs fine without it.

## Layout

```
src/
  assets/models/       The two GLB assets
  components/
    layout/            Toolbar, sidebar
    slides/            Canvas, scaling, presentation & presenter views
    ui/                shadcn primitives
  hooks/               Presenter notes + cross-window presenter sync
  pages/               Index (editor), AudienceWindow, NotFound
  slides/azure/        The deck
    components.tsx     Shared slide system
    index.ts           The deck order, start here
    part1…part5        Slide groups
    interactive_city   The 3D walkthrough
    city3d/            Scene, scenarios, colour tokens
```
