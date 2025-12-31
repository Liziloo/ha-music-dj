import WebSocket from "ws";
import { MA_URL, MA_TOKEN } from "./config.js";

let msgId = 1;

function send(ws, payload) {
  ws.send(JSON.stringify({ message_id: String(msgId++), ...payload }));
}

export function connectMA(onEvent) {
  const ws = new WebSocket(MA_URL);

  ws.on("open", () => {
    console.log("MA WS connected");
    send(ws, {
      command: "auth",
      args: { token: MA_TOKEN },
    });
  });

  ws.on("message", (raw) => {
    const msg = JSON.parse(raw);

    // Auth response
    if (msg.result?.authenticated) {
      console.log("MA authenticated");
      return;
    }

    // Event messages
    if (msg.event) {
      onEvent(msg);
    }
  });

  ws.on("error", (err) => {
    console.error("MA WS error", err);
  });
}
