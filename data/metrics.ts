/* Every array here is measured, sourced from the repos. Nothing is invented.
   If a project has no committed metric, it has no entry — and no strip. */

/* EvoCreatures — best fitness per generation, 31 generations.
   Source: web/replays/history.json in AnshadityaSharma/evocreatures
   (generations[].best, rounded to 3dp). 0 → 13.919. */
export const evoBestFitness: number[] = [
  0, 0, 0, 0, 0, 1.278, 1.278, 2.424, 4.953, 5.415, 5.415, 5.415, 5.875,
  5.875, 5.875, 5.875, 5.875, 5.875, 7.303, 7.303, 7.303, 9.535, 9.535,
  9.535, 9.535, 10.299, 13.919, 13.919, 13.919, 13.919, 13.919,
];

/* Trading Exchange Simulator — submit latency across percentiles, µs.
   Source: bench/results.md (direct engine, default band ±50 ticks):
   p50 300ns · p95 700ns · p99 1.20µs · p99.9 21.5µs · max 3.63ms */
export const exchangeSubmitPercentiles: { label: string; us: number }[] = [
  { label: "p50", us: 0.3 },
  { label: "p95", us: 0.7 },
  { label: "p99", us: 1.2 },
  { label: "p99.9", us: 21.5 },
  { label: "max", us: 3630 },
];

/* Same data as a log-scaled series for the detail-page strip. */
export const exchangePercentileSeries: number[] =
  exchangeSubmitPercentiles.map((p) => Math.log10(p.us * 1000)); // ns, log10

/* Exchange headline numbers, quoted from bench/results.md. */
export const exchangeBench = {
  throughputMean: "2,103,613 ops/sec",
  throughputWorst: "1,535,548 ops/sec",
  submitP50: "300ns",
  submitP99: "1.20µs",
  deepBookP99: "2.30µs",
  deepBookThroughput: "1,475,921 ops/sec",
  httpP50: "13.88ms",
  httpThroughput: "1,306 orders/sec",
} as const;

/* EvoCreatures headline numbers, quoted from the repo README. */
export const evoHeadline = {
  generations: 30,
  bestFitness: 13.919,
  distance: "~21 metres in 8 seconds",
  forwardMovers: "0% → 42%",
  genes: 19,
} as const;
