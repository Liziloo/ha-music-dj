import fs from "fs";

const FILE = "./storage.json";

let data = {
  artistQuarantineUntil: {},
};

export function loadStorage() {
  if (!fs.existsSync(FILE)) return;
  const raw = fs.readFileSync(FILE, "utf8").trim();
  if (!raw) return;
  data = JSON.parse(raw);
}

export function saveStorage() {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

export function getArtistQuarantineUntil(artist) {
  return data.artistQuarantineUntil[artist] ?? 0;
}

export function setArtistQuarantine(artist, until) {
  data.artistQuarantineUntil[artist] = until;
  saveStorage();
}
