import { BURST_COUNT, BURST_WINDOW, ARTIST_QUARANTINE } from "./config.js";
import { setState, getState } from "./state.js";

const shortPlays = [];
const artistSkips = new Map();

export function recordPlay(playMs, artistId, now) {
  if (playMs >= LONG_PLAY) {
    shortPlays.length = 0;
    return false;
  }

  if (playMs < SHORT_PLAY) {
    shortPlays.push(now);
    prune(shortPlays, now - BURST_WINDOW);

    const list = artistSkips.get(artistId) ?? [];
    list.push(now);
    prune(list, now - 45 * 60_000);
    artistSkips.set(artistId, list);

    if (list.length >= 2) {
      const state = getState();
      state.artistQuarantine[artistId] = now + ARTIST_QUARANTINE;
      setState(state);
    }

    return shortPlays.length >= BURST_COUNT;
  }

  return false;
}

function prune(arr, cutoff) {
  while (arr.length && arr[0] < cutoff) arr.shift();
}
