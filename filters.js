const recentTracks = new Map();

export function recordTrack(trackId, ts) {
  recentTracks.set(trackId, ts);
}

export function allowTrack(trackId, artistId, now, state) {
  if (recentTracks.has(trackId)) {
    if (now - recentTracks.get(trackId) < TRACK_REPEAT_BLOCK) {
      return false;
    }
  }

  const until = state.artistQuarantine[artistId];
  if (until && now < until) return false;

  return true;
}
