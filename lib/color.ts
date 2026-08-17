/**
 * Returns a readable text color (white or dark slate) for a given hex
 * background color, chosen by perceived luminance.
 */
export function contrastText(hex: string): string {
  const normalized = hex.replace(/^#/, '');
  const full = normalized.length === 3
    ? normalized.split('').map(c => c + c).join('')
    : normalized;

  const r = parseInt(full.slice(0, 2), 16) || 0;
  const g = parseInt(full.slice(2, 4), 16) || 0;
  const b = parseInt(full.slice(4, 6), 16) || 0;

  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 150 ? '#1E293B' : '#FFFFFF';
}