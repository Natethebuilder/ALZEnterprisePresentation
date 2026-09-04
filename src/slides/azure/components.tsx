import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { useSlideScale } from '@/components/slides/ScaledSlide';

/**
 * Microsoft-branded slide system for the Azure Landing Zones deck.
 *
 * Light Fluent surfaces, Azure navy + communication blue, diagram-first
 * layouts. Every colour comes from the `--slide-*` / `--ms-*` tokens defined
 * in index.css so the 2D slides and the 3D city stay in sync.
 */

/** Total slides in the deck. Kept here so the footer pager stays honest. */
export const TOTAL_SLIDES = 23;

/* ============================================================ Brand ===== */

/** The Microsoft four-square logo mark. */
export function MicrosoftLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 23 23" className={cn('h-6 w-6', className)} aria-label="Microsoft">
      <rect x="1" y="1" width="10" height="10" fill="hsl(var(--ms-logo-red))" />
      <rect x="12" y="1" width="10" height="10" fill="hsl(var(--ms-logo-green))" />
      <rect x="1" y="12" width="10" height="10" fill="hsl(var(--ms-logo-blue))" />
      <rect x="12" y="12" width="10" height="10" fill="hsl(var(--ms-logo-yellow))" />
    </svg>
  );
}

/** Microsoft wordmark + the deck's product lockup. */
export function BrandLockup({ dark }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <MicrosoftLogo className="h-6 w-6" />
      <span
        className={cn(
          'text-xl font-semibold tracking-tight',
          dark ? 'text-white' : 'text-slide-gray-900'
        )}
      >
        Microsoft
      </span>
      <span className={cn('h-5 w-px', dark ? 'bg-white/30' : 'bg-slide-gray-300')} />
      <span
        className={cn(
          'text-xl font-normal tracking-tight',
          dark ? 'text-white/80' : 'text-slide-primary'
        )}
      >
        Azure Landing Zones
      </span>
    </div>
  );
}

/* ============================================================ Layout ==== */

interface AZSlideProps {
  children: React.ReactNode;
  /** 1-based position in the deck, shown in the footer pager. */
  index: number;
  kicker?: string;
  className?: string;
  tone?: 'light' | 'dark';
}

export function AZSlide({ children, index, kicker, className, tone = 'light' }: AZSlideProps) {
  const dark = tone === 'dark';
  return (
    <div
      className={cn(
        'w-full h-full relative font-sans slide-content overflow-hidden',
        dark ? 'bg-slide-primary text-white' : 'bg-white text-slide-gray-900',
        className
      )}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-20 pt-10">
        <BrandLockup dark={dark} />
        {kicker && (
          <span
            className={cn(
              'text-lg font-semibold tracking-[0.14em] uppercase',
              dark ? 'text-white/55' : 'text-slide-gray-500'
            )}
          >
            {kicker}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="w-full h-full">{children}</div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-end px-20 pb-8">
        <span
          className={cn(
            'text-lg font-mono tabular-nums',
            dark ? 'text-white/45' : 'text-slide-gray-500'
          )}
        >
          {String(index).padStart(2, '0')} / {String(TOTAL_SLIDES).padStart(2, '0')}
        </span>
      </div>

      {/* Accent rail */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slide-accent" />
    </div>
  );
}

/** Content padding wrapper used inside AZSlide. */
export function Body({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('absolute inset-0 px-20 pt-28 pb-20 flex flex-col', className)}>
      {children}
    </div>
  );
}

/* ======================================================== Typography ==== */

export function Kicker({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center gap-3 mb-5', className)}>
      <span className="w-10 h-1 rounded-full bg-slide-accent" />
      <span className="text-lg font-semibold tracking-[0.18em] uppercase text-slide-accent">
        {children}
      </span>
    </div>
  );
}

export function Title({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn('font-display text-5xl font-semibold tracking-tight leading-[1.08] max-w-6xl', className)}>
      {children}
    </h2>
  );
}

export function Lead({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('text-xl text-slide-gray-600 font-light leading-snug max-w-5xl', className)}>
      {children}
    </p>
  );
}

/* ================================================ Diagram primitives ==== */

export type Tone = 'cloud' | 'navy' | 'light' | 'muted' | 'success' | 'warning' | 'error';

const toneClasses: Record<Tone, string> = {
  cloud: 'bg-slide-accent-muted border-slide-accent text-slide-primary',
  navy: 'bg-slide-primary text-white border-slide-primary',
  light: 'bg-white border-slide-gray-300 text-slide-gray-900',
  muted: 'bg-slide-gray-100 border-slide-gray-200 text-slide-gray-900',
  success: 'bg-[hsl(var(--slide-success)/0.10)] border-[hsl(var(--slide-success)/0.45)] text-slide-gray-900',
  warning: 'bg-[hsl(var(--slide-warning)/0.14)] border-[hsl(var(--slide-warning)/0.55)] text-slide-gray-900',
  error: 'bg-[hsl(var(--slide-error)/0.09)] border-[hsl(var(--slide-error)/0.45)] text-slide-gray-900',
};

export function toneSurface(t: Tone) {
  return toneClasses[t];
}

interface BoxProps {
  label: React.ReactNode;
  sub?: React.ReactNode;
  tone?: Tone;
  icon?: React.ReactNode;
  className?: string;
  compact?: boolean;
}

export function Box({ label, sub, tone = 'light', icon, className, compact }: BoxProps) {
  return (
    <div
      className={cn(
        'rounded border-2 flex flex-col',
        compact ? 'px-5 py-3' : 'px-6 py-5',
        toneClasses[tone],
        className
      )}
    >
      <div className="flex items-center gap-3">
        {icon && <div className="shrink-0">{icon}</div>}
        <div className="font-semibold leading-tight">{label}</div>
      </div>
      {sub && (
        <div
          className={cn(
            'mt-1 leading-snug text-lg',
            tone === 'navy' ? 'text-white/75' : 'text-slide-gray-600'
          )}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

export function Chip({
  children,
  tone = 'cloud',
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 text-lg font-semibold',
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function ArrowRight({ className, label }: { className?: string; label?: string }) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex items-center gap-1 text-slide-accent">
        <div className="h-0.5 w-10 bg-slide-accent" />
        <svg viewBox="0 0 12 12" className="w-4 h-4 fill-slide-accent">
          <path d="M0 6 12 6 6 0Z M6 12 12 6 6 6Z" />
        </svg>
      </div>
      {label && <span className="ml-2 text-base font-medium text-slide-gray-500">{label}</span>}
    </div>
  );
}

export function ArrowDown({ className, label }: { className?: string; label?: string }) {
  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div className="flex flex-col items-center gap-1 text-slide-accent">
        <div className="w-0.5 h-8 bg-slide-accent" />
        <svg viewBox="0 0 12 12" className="w-4 h-4 fill-slide-accent rotate-90">
          <path d="M0 6 12 6 6 0Z M6 12 12 6 6 6Z" />
        </svg>
      </div>
      {label && <span className="mt-1 text-base font-medium text-slide-gray-500">{label}</span>}
    </div>
  );
}

export function Legend({ items }: { items: { tone: Tone; label: string }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-2">
          <span className={cn('w-4 h-4 rounded-sm border-2', toneClasses[it.tone])} />
          <span className="text-lg text-slide-gray-600">{it.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ==================================================== Section divider === */

export function SectionDivider({
  index,
  eyebrow,
  title,
  items,
}: {
  index: number;
  eyebrow: string;
  title: string;
  items: string[];
}) {
  return (
    <AZSlide index={index} kicker={eyebrow} tone="dark">
      <div className="absolute inset-0 px-20 pt-28 pb-20 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-8">
          <span className="w-12 h-1 rounded-full bg-slide-accent-light" />
          <span className="text-lg font-semibold tracking-[0.18em] uppercase text-slide-accent-light">
            {eyebrow}
          </span>
        </div>
        <h1 className="font-display text-7xl font-semibold tracking-tight leading-[1.02] max-w-5xl text-white">
          {title}
        </h1>
        <div className="mt-12 flex flex-wrap gap-3 max-w-5xl">
          {items.map((it, i) => (
            <span
              key={it}
              className="px-5 py-2.5 rounded-full border-2 border-white/25 text-white/85 text-lg font-medium"
            >
              {String(i + 1).padStart(2, '0')} · {it}
            </span>
          ))}
        </div>
      </div>
    </AZSlide>
  );
}

/* ================================================ Interactive helpers === */

/**
 * True when this slide is the one actually being presented, rather than a
 * thumbnail in the sidebar or the overview grid. Interactive slides use it to
 * avoid binding global keys (and to skip WebGL) for every thumbnail on screen.
 */
export function useIsLiveSlide() {
  return useSlideScale() > 0.3;
}

interface StepperOptions {
  /** Number of steps, including the initial one. */
  count: number;
  /** Bind Space / Backspace to advance and rewind. Only when live. */
  keyboard?: boolean;
}

/**
 * Click-through build state for a slide.
 *
 * Nothing advances on a timer: the presenter is always the one moving
 * forward. Space and Backspace are captured (and stopped) only while this
 * slide is the live one, so they never leak into the deck-level navigation.
 */
export function useStepper({ count, keyboard = true }: StepperOptions) {
  const [step, setStep] = useState(0);
  const live = useIsLiveSlide();

  const next = useCallback(() => setStep((s) => Math.min(count - 1, s + 1)), [count]);
  const prev = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);
  const reset = useCallback(() => setStep(0), []);
  const goTo = useCallback((i: number) => setStep(Math.max(0, Math.min(count - 1, i))), [count]);

  useEffect(() => {
    if (!keyboard || !live) return;
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
    // Capture phase so the slide's build wins over deck navigation.
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [keyboard, live, next, prev]);

  return {
    step,
    setStep: goTo,
    next,
    prev,
    reset,
    isFirst: step === 0,
    isLast: step === count - 1,
    count,
  };
}

/** Fades content in once the build reaches `at`. Layout is reserved either way. */
export function Reveal({
  at,
  step,
  children,
  className,
}: {
  at: number;
  step: number;
  children: React.ReactNode;
  className?: string;
}) {
  const shown = step >= at;
  return (
    <div
      className={cn('transition-all duration-500 ease-out', className)}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : 'translateY(12px)',
        pointerEvents: shown ? 'auto' : 'none',
      }}
      aria-hidden={!shown}
    >
      {children}
    </div>
  );
}

/**
 * The standard control bar for a stepped slide: Back, Next, a step counter and
 * a row of dots you can jump straight to.
 */
export function StepControls({
  step,
  count,
  onPrev,
  onNext,
  onSelect,
  labels,
  className,
}: {
  step: number;
  count: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (i: number) => void;
  labels?: string[];
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <button
        type="button"
        onClick={onPrev}
        disabled={step === 0}
        className="px-5 py-2.5 rounded-full border-2 border-slide-gray-300 text-slide-gray-700 text-lg font-semibold disabled:opacity-35 hover:border-slide-accent hover:text-slide-accent transition-colors"
      >
        Back
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={step >= count - 1}
        className="px-6 py-2.5 rounded-full bg-slide-accent text-white text-lg font-semibold disabled:opacity-35 hover:bg-slide-primary-light transition-colors"
      >
        Next
      </button>
      <div className="flex items-center gap-2 ml-2">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            title={labels?.[i]}
            aria-label={labels?.[i] ?? `Step ${i + 1}`}
            className={cn(
              'h-2.5 rounded-full transition-all duration-300',
              i === step ? 'w-8 bg-slide-accent' : 'w-2.5 bg-slide-gray-300 hover:bg-slide-gray-400'
            )}
          />
        ))}
      </div>
      <span className="ml-auto text-lg font-mono tabular-nums text-slide-gray-500">
        {step + 1} / {count}
      </span>
    </div>
  );
}

/** Small helper so slides can memoise derived data without re-importing React. */
export { useMemo };
