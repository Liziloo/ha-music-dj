import WebSocket from "ws";
import { HA_URL, HA_TOKEN } from "./config.js";

export function connectWS(onReady) {
  const wsUrl = HA_URL.replace("http", "ws") + "/api/websocket";
  const ws = new WebSocket(wsUrl);

  ws.on("open", () => {
    console.log("WS connected");
  });

  ws.on("message", (msg) => {
    const data = JSON.parse(msg);

    if (data.type === "auth_required") {
      ws.send(
        JSON.stringify({
          type: "auth",
          access_token: HA_TOKEN,
        })
      );
      return;
    }

    if (data.type === "auth_ok") {
      console.log("WS authenticated");
      onReady(ws);
      return;
    }

    if (data.type === "auth_invalid") {
      console.error("WS auth failed");
      process.exit(1);
    }
  });

  ws.on("error", (err) => {
    console.error("WS error", err);
  });
}
