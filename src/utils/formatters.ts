// formatters.ts

/** Formats a UTC ISO string to a readable local date and time. */
export const formatDateTime = (iso: string) =>
  new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));

/** Formats a UTC ISO string to a readable local date only. */
export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(iso));

/** Converts metres to a human-readable miles string. */
export const metresToMiles = (metres: number) =>
  `${(metres / 1609.34).toFixed(1)} mi`;

/** Returns a star string representation of a 1–5 rating. */
export const formatRating = (rating: number) =>
  rating > 0 ? rating.toFixed(1) : '—';

/** Formats a trust weight multiplier for display. */
export const formatTrustWeight = (weight: number) => weight.toFixed(2);

/** Returns a relative time string (e.g. "3 days ago"). */
export const timeAgo = (iso: string) => {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  const intervals: [number, string][] = [
    [31536000, 'year'],
    [2592000, 'month'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
  ];
  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`;
  }
  return 'just now';
};
