import "dotenv/config";
import { connectMA, maCommand } from "./ma.js";
import { handleMAEvent } from "./events.js";
import { recordTrackEnd, getSkipCounts } from "./skips.js";
import { loadStorage } from "./storage.js";
import {
  recordTrackStarted,
  shouldAutoSkipOnStart,
  recordSkipForQuarantine,
} from "./hygiene.js";
import { connectHA } from "./ha.js";


loadStorage();

let djEnabled = true; // default until HA tells us otherwise

console.log("DJ initial state =", djEnabled);

let wsRef = null;

function emit(type, payload) {
  const now = Date.now();

  if (type === "TRACK_STARTED") {
    const artist = payload.artists?.[0] ?? "Unknown";

    // FIRST: check hygiene rules
    const hit = shouldAutoSkipOnStart(
      { trackUri: payload.trackUri, artist },
      now
    );

    if (djEnabled && hit && wsRef && payload.queueId) {
      console.log(
        "AUTO-SKIP on start:",
        hit.reason,
        "-",
        payload.title,
        "-",
        artist
      );
      maCommand(wsRef, "player_queues/next", { queue_id: payload.queueId });
      return;
    }

    // ONLY IF ALLOWED: record as recently played
    if (payload.trackUri) {
      recordTrackStarted(payload.trackUri, now);
    }
  }


  if (type === "TRACK_ENDED") {
    recordTrackEnd(payload);
    console.log("SKIPS:", getSkipCounts());

    // If this was a skip (fast), feed quarantine model
    if (!payload.inferred && (payload.secondsPlayed ?? 9999) < 45) {
      recordSkipForQuarantine(payload.artist, now);
    }

  }

  // Keep the raw normalized output while we validate
  console.log(type, payload);
}

connectHA((event) => {
  if (event?.data?.entity_id === "input_boolean.music_dj_enabled") {
    djEnabled = event.data.new_state.state === "on";
    console.log("DJ enabled =", djEnabled);
  }
});

connectMA(
  (msg) => handleMAEvent(msg, emit),
  (ws) => {
    wsRef = ws;
  }
);
