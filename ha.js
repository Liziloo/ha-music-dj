import fetch from "node-fetch";
import WebSocket from "ws";
import { HA_URL, HA_TOKEN } from "./config.js";

export function haFetch(path, body) {
  return fetch(`${HA_URL}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HA_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export function connectWS(onEvent) {
  const ws = new WebSocket(`${HA_URL.replace("http", "ws")}/api/websocket`);

  ws.on("open", () => {
    ws.send(JSON.stringify({ type: "auth", access_token: HA_TOKEN }));
  });

  ws.on("message", (msg) => {
    const data = JSON.parse(msg);
    onEvent(data);
  });
}
