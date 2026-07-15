"use client";

/* The signature element: a genuinely 4px-tall SVG sparkline.
   - static data → graphite stroke (it isn't moving, so it's grayscale)
   - live slug   → subscribes to the demo's real series → signal stroke
   No fake curves: render nothing when there is no data. */

import { useSyncExternalStore } from "react";
import { getServerSnapshot, getSnapshot, subscribe } from "@/lib/liveStore";

const W = 800;
const H = 4;
const PAD = 0.7;

function buildPath(data: number[]): string {
  if (data.length < 2) return "";
  let min = Infinity;
  let max = -Infinity;
  for (const v of data) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  const range = max - min || 1;
  let d = "";
  for (let i = 0; i < data.length; i++) {
    const x = (i / (data.length - 1)) * W;
    const y = H - PAD - ((data[i] - min) / range) * (H - 2 * PAD);
    d += (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(2) + " ";
  }
  return d.trim();
}

function Strip({ data, live }: { data: number[]; live: boolean }) {
  if (data.length < 2) return null;
  return (
    <svg
      width="100%"
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="mt-[18px] block"
      aria-hidden="true"
    >
      <path
        d={buildPath(data)}
        fill="none"
        stroke={live ? "var(--color-signal)" : "var(--color-graphite)"}
        strokeWidth={1}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function LiveFitnessStrip({ slug }: { slug: string }) {
  const snap = useSyncExternalStore(
    (cb) => subscribe(slug, cb),
    () => getSnapshot(slug),
    getServerSnapshot,
  );
  if (!snap.series || snap.series.length < 2) return null;
  return <Strip data={snap.series} live={snap.status === "running" || snap.status === "live"} />;
}

export default function FitnessStrip({ data }: { data: number[] }) {
  return <Strip data={data} live={false} />;
}
