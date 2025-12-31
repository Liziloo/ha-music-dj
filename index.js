import "dotenv/config";
import { connectMA } from "./ma.js";
import { handleMAEvent } from "./events.js";
import { recordTrackEnd, getSkipCounts } from "./skips.js";

function emit(type, payload) {
  if (type === "TRACK_ENDED") {
    recordTrackEnd(payload);
    console.log("SKIPS:", getSkipCounts());
  }

  console.log(type, payload);
}

connectMA((msg) => {
  handleMAEvent(msg, emit);
});
