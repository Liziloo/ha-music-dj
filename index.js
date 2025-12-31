import "dotenv/config";
import { connectMA } from "./ma.js";
import { handleMAEvent } from "./events.js";

function emit(type, payload) {
  console.log(type, payload);
}

connectMA((msg) => {
  handleMAEvent(msg, emit);
});
