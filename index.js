import "dotenv/config";
import { connectWS } from "./ha.js";

connectWS(() => {
  console.log("Connected to Home Assistant WebSocket API");
});
