/**
 * Reads slide design tokens straight out of the DOM so the 3D city uses the
 * exact same Microsoft palette as the rest of the deck; no hardcoded hex in
 * the scene, and the city follows any future token change automatically.
 */

function readToken(token: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  return raw || fallback;
}

/** `--slide-accent` → `hsl(206,100%,42%)`, ready for a THREE.Color. */
export function cssColor(token: string, fallback = '0 0% 50%'): string {
  return `hsl(${readToken(token, fallback).replace(/\s+/g, ',')})`;
}

export function cityPalette() {
  return {
    /* Microsoft brand */
    accent: cssColor('--ms-blue', '206 100% 42%'),
    accentLight: cssColor('--ms-cyan', '189 100% 66%'),
    navy: cssColor('--ms-navy', '217 45% 25%'),

    /* Neutrals */
    ground: cssColor('--slide-gray-100', '30 8% 95%'),
    muted: cssColor('--slide-gray-400', '30 4% 78%'),
    dim: cssColor('--slide-gray-500', '30 2% 62%'),

    /* Semantics */
    success: cssColor('--slide-success', '120 77% 27%'),
    warning: cssColor('--slide-warning', '44 100% 50%'),
    error: cssColor('--slide-error', '358 63% 51%'),
  };
}

export type CityPalette = ReturnType<typeof cityPalette>;
