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
    data = JSON.parse(fs.readFileSync(FILE, "utf8"));
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
