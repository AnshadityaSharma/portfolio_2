"use client";

/* The right end of the mono header row. --signal only when something is
   actually alive; every other state is graphite and does not pulse. */

import { useSyncExternalStore } from "react";
import {
  getServerSnapshot,
  getSnapshot,
  subscribe,
  type SlotStatus,
} from "@/lib/liveStore";

const LABELS: Record<SlotStatus, string> = {
  running: "running",
  live: "live",
  connecting: "connecting",
  offline: "offline",
  gated: "on request",
  recorded: "recorded",
  local: "local only",
};

export default function StatusBadge({
  slug,
  initial,
}: {
  slug: string;
  initial: SlotStatus;
}) {
  const snap = useSyncExternalStore(
    (cb) => subscribe(slug, cb),
    () => getSnapshot(slug),
    getServerSnapshot,
  );
  /* server snapshot is "connecting"; prefer the declared initial until a
     demo actually publishes */
  const status: SlotStatus =
    snap.metricLine === null && snap.series === null && snap.status === "connecting"
      ? initial
      : snap.status;

  const alive = status === "running" || status === "live";
  return (
    <span
      className={`flex items-center gap-2 font-mono text-meta ${
        alive ? "text-signal" : "text-graphite"
      }`}
    >
      <span
        className={alive ? "signal-dot" : "h-[7px] w-[7px] shrink-0 rounded-full bg-rule"}
      />
      {LABELS[status]}
    </span>
  );
}
