import WebSocket from "ws";
import { HA_URL, HA_TOKEN } from "./config.js";

export function connectHA(onEvent, onReady) {
  const wsUrl = HA_URL.replace("http", "ws") + "/api/websocket";
  const ws = new WebSocket(wsUrl);

  ws.on("open", () => {
    console.log("HA WS connected");
  });

  ws.on("message", (raw) => {
    const msg = JSON.parse(raw);

    if (msg.type === "auth_required") {
      ws.send(
        JSON.stringify({
          type: "auth",
          access_token: HA_TOKEN,
        })
      );
      return;
    }

    if (msg.type === "auth_ok") {
      console.log("HA authenticated");

      ws.send(
        JSON.stringify({
          id: 1,
          type: "subscribe_events",
          event_type: "state_changed",
        })
      );

      onReady?.(ws);
      return;
    }

    if (msg.type === "auth_invalid") {
      console.error("HA auth invalid:", msg.message ?? msg);
      return;
    }

    if (msg.type === "event") {
      onEvent(msg.event);
    }
  });

  ws.on("error", (err) => {
    console.error("HA WS error", err);
  });
}
