import { loadState, getState, setState } from "./state.js";
import { recordPlay } from "./skips.js";
import { PLAYLISTS, DJ_COOLDOWN } from "./config.js";
import { connectWS, haFetch } from "./ha.js";

loadState();

let currentTrackStart = null;
let currentArtist = null;

connectWS((event) => {
  // TODO: filter only MA / Spotify / active player events

  if (event.type === "track_started") {
    currentTrackStart = Date.now();
    currentArtist = event.artist_id;
  }

  if (event.type === "track_ended" && currentTrackStart) {
    const now = Date.now();
    const played = now - currentTrackStart;
    const burst = recordPlay(played, currentArtist, now);

    if (burst) maybeTransition(now);
  }
});

function maybeTransition(now) {
  const state = getState();
  if (now < state.cooldownUntil) return;

  // TODO: infer direction + select next class
  // placeholder: no-op
}

function transitionTo(domain, cls, now) {
  const key = `${domain}:${cls}`;
  const playlist = PLAYLISTS[key];
  if (!playlist) return;

  haFetch("/api/services/music_assistant/play_media", {
    media_id: playlist,
    enqueue: "replace",
    shuffle: true,
  });

  setState({
    domain,
    class: cls,
    cooldownUntil: now + DJ_COOLDOWN,
  });
}
