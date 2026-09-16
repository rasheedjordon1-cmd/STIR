/**
 * WCAG 2.2 relative-luminance contrast, used by the /system route to print a
 * real ratio beside every colour pairing the interface relies on. A token pair
 * that fails should be fixed in styles/tokens.css, not worked around locally.
 */
function channel(value: number): number {
  const c = value / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [light, dark] = la > lb ? [la, lb] : [lb, la];
  return Math.round(((light + 0.05) / (dark + 0.05)) * 100) / 100;
}

export function grade(ratio: number): { label: string; pass: boolean } {
  if (ratio >= 7) return { label: 'AAA', pass: true };
  if (ratio >= 4.5) return { label: 'AA', pass: true };
  if (ratio >= 3) return { label: 'AA large / UI', pass: true };
  return { label: 'Fails', pass: false };
}
