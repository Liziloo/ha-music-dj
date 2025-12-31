import fs from "fs";

const FILE = "./storage.json";

let data = {
  domain: "NC",
  class: "BG_STEADY",
  cooldownUntil: 0,
  artistQuarantine: {},
};

export function loadState() {
  if (fs.existsSync(FILE)) {
    const raw = fs.readFileSync(FILE, "utf8").trim();
    if (raw) {
      data = JSON.parse(raw);
    }
  }
}

export function saveState() {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

export function getState() {
  return data;
}

export function setState(update) {
  Object.assign(data, update);
  saveState();
}
