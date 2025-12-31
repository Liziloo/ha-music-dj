let lastQueueItemId = null;
let lastTrack = null;
let lastTrackStartedAt = null;
let lastTrackEnded = false;

const RAPID_SKIP_SECONDS = 15;

export function handleMAEvent(msg, emit) {
  const { event, data } = msg;

  const now = Date.now();

  // --- TRACK START ---
  if (event === "queue_updated" || event === "queue_items_updated") {
    const current = data?.current_item;
    if (!current) return;

    const qid = current.queue_item_id;
    if (!qid || qid === lastQueueItemId) return;

    // Fallback skip inference
    if (
      lastTrack &&
      !lastTrackEnded &&
      lastTrackStartedAt &&
      (now - lastTrackStartedAt) / 1000 < RAPID_SKIP_SECONDS
    ) {
      emit("TRACK_ENDED", {
        trackUri: lastTrack.trackUri,
        title: lastTrack.title,
        artist: lastTrack.artist,
        secondsPlayed: (now - lastTrackStartedAt) / 1000,
        fullyPlayed: false,
        inferred: true,
      });
    }

    lastQueueItemId = qid;
    lastTrackEnded = false;
    lastTrackStartedAt = now;

    lastTrack = {
      trackUri: current.media_item?.uri,
      title: current.media_item?.name,
      artist: current.media_item?.artists?.[0]?.name ?? "Unknown",
    };

    emit("TRACK_STARTED", {
      queueItemId: qid,
      trackId: current.media_item?.item_id,
      title: current.media_item?.name,
      artists: current.media_item?.artists?.map((a) => a.name) ?? [],
      duration: current.media_item?.duration ?? null,
      trackUri: current.media_item?.uri,
      queueId: current.queue_id,
    });

    return;
  }

  // --- TRACK END (authoritative) ---
  if (event === "media_item_played") {
    lastTrackEnded = true;

    emit("TRACK_ENDED", {
      trackUri: data.uri,
      title: data.name,
      artist: data.artist,
      secondsPlayed: data.seconds_played,
      fullyPlayed: data.fully_played,
      inferred: false,
    });
  }
}
