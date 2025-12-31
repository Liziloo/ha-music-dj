const SKIP_SECONDS_THRESHOLD = 300;

const WINDOW_MS = 60 * 1000; // 1 minute instead of 10

const recentEnds = new Set();
const artistSkips = new Map();

function prune(now) {
  for (const [artist, entries] of artistSkips.entries()) {
    const filtered = entries.filter((e) => now - e.ts <= WINDOW_MS);
    if (filtered.length === 0) {
      artistSkips.delete(artist);
    } else {
      artistSkips.set(artist, filtered);
    }
  }
}

export function recordTrackEnd(evt) {
  const { trackUri, artist, secondsPlayed } = evt;

  // Deduplicate repeated MA events
  if (recentEnds.has(trackUri)) return;
  recentEnds.add(trackUri);
  setTimeout(() => recentEnds.delete(trackUri), 60_000);

  if (secondsPlayed >= SKIP_SECONDS_THRESHOLD) return;

  const now = Date.now();
  prune(now);

  if (!artistSkips.has(artist)) {
    artistSkips.set(artist, []);
  }

  artistSkips.get(artist).push({ ts: now });
}

export function getSkipCounts() {
  const out = {};
  for (const [artist, entries] of artistSkips.entries()) {
    out[artist] = entries.length;
  }
  return out;
}
