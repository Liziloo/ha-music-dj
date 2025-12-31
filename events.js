let lastQueueItemId = null;

export function handleMAEvent(msg, emit) {
  const { event, data } = msg;

  // --- TRACK START ---
  if (event === "queue_updated" || event === "queue_items_updated") {
    const current = data?.current_item;
    if (!current) return;

    const qid = current.queue_item_id;
    if (!qid || qid === lastQueueItemId) return;

    lastQueueItemId = qid;

    emit("TRACK_STARTED", {
      queueItemId: qid,
      trackId: current.media_item?.item_id,
      title: current.media_item?.name,
      artists: current.media_item?.artists?.map((a) => a.name) ?? [],
      duration: current.media_item?.duration ?? null,
    });

    return;
  }

  // --- TRACK END / SKIP ---
  if (event === "media_item_played") {
    emit("TRACK_ENDED", {
      trackUri: data.uri,
      title: data.name,
      artist: data.artist,
      secondsPlayed: data.seconds_played,
      fullyPlayed: data.fully_played,
    });
  }
}
