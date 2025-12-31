export const HA_URL = "http://192.168.4.200:8123";
export const HA_TOKEN = process.env.HA_TOKEN;
export const MA_URL = process.env.MA_URL;
export const MA_TOKEN = process.env.MA_TOKEN;


export const PLAYLISTS = {
  "NC:BG_STEADY": "Background",
  "NC:BG_UP": "Less Angst",
  "NC:FG_STEADY": "Storytellers",
  "NC:FG_UP": "Marching Orders",

  "CHR:BG_STEADY": "Christian 2025",
  "CHR:FG_STEADY": "Top Contemporary Christian",
};

export const SHORT_PLAY = 30_000;
export const LONG_PLAY = 90_000;

export const BURST_COUNT = 3;
export const BURST_WINDOW = 10 * 60_000;

export const TRACK_REPEAT_BLOCK = 30 * 60_000;
export const ARTIST_QUARANTINE = 2 * 60 * 60_000;

export const DJ_COOLDOWN = 30 * 60_000;
