import { getArtistQuarantineUntil, setArtistQuarantine } from "./storage.js";

const TRACK_REPEAT_BLOCK_MS = 30 * 60_000; // 30 minutes
const ARTIST_QUARANTINE_MS = 2 * 60 * 60_000; // 2 hours

// Recent track memory (in-memory only)
const recentTracks = new Map(); // trackUri -> lastSeenTs

// Artist skip timestamps (for deciding quarantine)
const artistSkipTimes = new Map(); // artist -> [ts...]

const ARTIST_SKIP_WINDOW_MS = 45 * 60_000; // 45 minutes
const ARTIST_SKIP_THRESHOLD = 3;

export function recordTrackStarted(trackUri, now) {
  if (!trackUri) return;
  recentTracks.set(trackUri, now);
}

export function shouldAutoSkipOnStart({ trackUri, artist }, now) {
  // Track replay suppression
  if (trackUri && recentTracks.has(trackUri)) {
    const last = recentTracks.get(trackUri);
    if (now - last < TRACK_REPEAT_BLOCK_MS) return { reason: "recent_track" };
  }

  // Artist quarantine
  if (artist) {
    const until = getArtistQuarantineUntil(artist);
    if (until && now < until) return { reason: "artist_quarantine" };
  }

  return null;
}

export function recordSkipForQuarantine(artist, now) {
  if (!artist) return;

  const arr = artistSkipTimes.get(artist) ?? [];
  arr.push(now);

  // prune
  const pruned = arr.filter((ts) => now - ts <= ARTIST_SKIP_WINDOW_MS);
  artistSkipTimes.set(artist, pruned);

  // quarantine if threshold met
  if (pruned.length >= ARTIST_SKIP_THRESHOLD) {
    const until = now + ARTIST_QUARANTINE_MS;
    setArtistQuarantine(artist, until);
    // reset the list so it doesn’t immediately retrigger
    artistSkipTimes.set(artist, []);
  }
}
