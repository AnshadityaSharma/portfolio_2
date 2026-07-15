/* Tiny client-side store: demos publish their live series + metric line,
   FitnessStrip / MetricLine / StatusBadge subscribe by slug.
   Keeps <ProjectSlot> a single shape with no per-project variants. */

export type SlotStatus =
  | "running" /* alive right now — the only state that earns --signal */
  | "live" /* connected to the real deployed feed                     */
  | "connecting"
  | "offline"
  | "gated" /* waiting for an explicit user click (webcam)            */
  | "recorded" /* hardware footage                                    */
  | "local"; /* runs locally only                                     */

export interface SlotLive {
  status: SlotStatus;
  series: number[] | null;
  metricLine: string | null;
}

const state = new Map<string, SlotLive>();
const listeners = new Map<string, Set<() => void>>();

const EMPTY: SlotLive = { status: "connecting", series: null, metricLine: null };

export function publish(slug: string, partial: Partial<SlotLive>): void {
  const prev = state.get(slug) ?? EMPTY;
  state.set(slug, { ...prev, ...partial });
  listeners.get(slug)?.forEach((l) => l());
}

export function subscribe(slug: string, cb: () => void): () => void {
  let set = listeners.get(slug);
  if (!set) {
    set = new Set();
    listeners.set(slug, set);
  }
  set.add(cb);
  return () => {
    set.delete(cb);
  };
}

export function getSnapshot(slug: string): SlotLive {
  return state.get(slug) ?? EMPTY;
}

export function getServerSnapshot(): SlotLive {
  return EMPTY;
}
