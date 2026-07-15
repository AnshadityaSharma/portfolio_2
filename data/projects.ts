/* All copy and numbers come from the repos — nothing is invented.
   Exchange: bench/results.md + docs/decisions.md
   EvoCreatures: README + web/replays/history.json
   Gridspace / LectureFind / Hand Cricket: their READMEs
   Rover: ESP32-CAM + Gemini Vision final-year project (repo pending) */

export interface Metric {
  label: string;
  value: string;
}

export interface Project {
  slug: string;
  number: string;
  title: string;
  oneLiner: string; // one line on the card
  headlineMetric: string; // mono, on the card
  thumb: string; // /thumbs/<slug>.png — placeholder until added
  repo?: string;
  live?: string;
  /* ---- detail page ---- */
  problem: string;
  decision: { heading: string; body: string[]; rejected: string };
  metrics: Metric[];
  /* how those metrics were produced — the honest label */
  metricsNote: string;
  limitations: { tag: string; body: string }[];
}

export const projects: Project[] = [
  {
    slug: "exchange",
    number: "01",
    title: "Trading exchange simulator",
    oneLiner: "A price-time-priority matching engine written from scratch.",
    headlineMetric: "2,103,613 ops/sec · p99 submit 1.2µs",
    thumb: "/thumbs/exchange.png",
    repo: "https://github.com/AnshadityaSharma/Trading-Exchange-Simulator",
    problem:
      "Paper-trading sites bolt a database onto every order and call it an exchange. A real matching engine is an in-memory, single-threaded data-structure problem: the database must never sit inside the match path.",
    decision: {
      heading: "a sorted price array over a heap",
      body: [
        "The book is a hashmap for O(1) level lookup plus a sorted price array with the best price at the end, and an intrusive doubly-linked FIFO queue per level. The array insert is O(L) — and that is fine, because a liquid book clusters near the touch: tens of levels, not thousands, and the O(L) splice is a contiguous memmove, extremely fast and cache-friendly.",
        "Persistence is write-behind: mutations queue and flush in ~50ms batches, so the engine never blocks on Postgres. A synchronous commit would add a ~1ms round trip inside every submission — a 1000× tax. The accepted cost is a crash-loss window of roughly the last 100ms.",
      ],
      rejected:
        "A binary heap was rejected because cancels are the problem — finding an arbitrary element in a heap is O(L) anyway, and it still needs per-level FIFO queues. A red-black tree was rejected as ~200 lines of hand-written rebalancing for no measured win. Synchronous per-order DB commits were rejected as the 1000× tax above.",
    },
    metrics: [
      { label: "throughput, mean", value: "2,103,613 ops/sec" },
      { label: "submit p50", value: "300ns" },
      { label: "submit p99", value: "1.20µs" },
      { label: "deep book (±5000 ticks) p99", value: "2.30µs" },
      { label: "deep book throughput", value: "1,475,921 ops/sec" },
      { label: "full http path", value: "1,306 orders/sec sustained" },
    ],
    metricsNote:
      "Measured on the repo's benchmark harness (bench/results.md): a deterministic xorshift-seeded workload replayed through the compiled engine, each op timed with hrtime.bigint(). 100× more price levels moved p99 from 1.5µs to 2.3µs and throughput stayed above 1.4M ops/sec — the experiment that justifies the array over the tree.",
    limitations: [
      {
        tag: "crash loss",
        body: "Write-behind persistence means a hard crash loses roughly the last 100ms of history. Acceptable for paper trading; stated up front.",
      },
      {
        tag: "restart",
        body: "The order book lives only in memory — it dies with the process. Any order still open at boot is canceled and reconciled.",
      },
      {
        tag: "cold start",
        body: "The database is Neon free tier; its compute suspends when idle and the first request after a quiet period takes ~1–2s.",
      },
      {
        tag: "single core",
        body: "One instance, one engine thread per instrument. Sharding across instruments is the v2 design, not the v1 reality.",
      },
    ],
  },
  {
    slug: "evocreatures",
    number: "02",
    title: "EvoCreatures",
    oneLiner: "Segmented creatures evolve locomotion from nothing.",
    headlineMetric: "best fitness 13.919 · 30 generations",
    thumb: "/thumbs/evocreatures.png",
    repo: "https://github.com/AnshadityaSharma/evocreatures",
    live: "https://evocreatures.vercel.app/",
    problem:
      "Can coordinated movement emerge from selection pressure alone? Each creature is seven connected boxes and a 19-gene central-pattern-generator brain — one shared gait frequency plus amplitude, phase and centre-angle per joint. Nothing tells it how to walk.",
    decision: {
      heading: "offline evolution, replay-only frontend",
      body: [
        "Evolution runs in Python and exports JSON replays per generation; the Three.js frontend only plays them back. The site needs no server-side runtime at all — every gait you scrub through is a recorded, reproducible run, and the fitness history shipping with it is the actual measurement.",
        "The fitness function is fitness = max(0, forward_distance − 0.015·energy − launch_penalty): rightward crawling pays, wasted energy and aerial launches cost. Tournament selection with elitism (top 3 preserved) and Gaussian mutation that anneals from broad to narrow.",
      ],
      rejected:
        "Live in-browser evolution was rejected: it makes results non-reproducible, ties fitness to the viewer's frame rate, and turns a measured claim into a demo effect. The replay JSONs are the evidence.",
    },
    metrics: [
      { label: "best fitness, generation 0", value: "0.000" },
      { label: "best fitness, generation 30", value: "13.919" },
      { label: "distance travelled", value: "~21 metres in 8 seconds" },
      { label: "forward-moving creatures", value: "0% → 42%" },
      { label: "genome", value: "19 genes · cpg brain" },
    ],
    metricsNote:
      "Taken from the committed run in web/replays/history.json — generations[].best over 30 generations. Not a redrawing; the numbers ship with the repo.",
    limitations: [
      {
        tag: "fixed morphology",
        body: "The body plan is a fixed 2d worm — evolution tunes the controller, not the anatomy.",
      },
      {
        tag: "no senses",
        body: "Creatures have no sensory feedback; gaits are open-loop pattern generators.",
      },
      {
        tag: "flat world",
        body: "Evolution ran on flat ground only. A gait that scores 13.9 here says nothing about slopes.",
      },
    ],
  },
  {
    slug: "gridspace",
    number: "03",
    title: "Gridspace",
    oneLiner: "A real-time collaborative canvas with live cursors.",
    headlineMetric: "live cursors · host-gated sessions",
    thumb: "/thumbs/gridspace.png",
    repo: "https://github.com/AnshadityaSharma/Gridspace",
    live: "https://gridspace.vercel.app/",
    problem:
      "Multiple people drawing on one canvas is a distributed-state problem: every stroke, cursor move and permission change has to converge on every screen without a central tick.",
    decision: {
      heading: "firestore as the state authority",
      body: [
        "All shared state — strokes, cursors, membership, permissions — lives in Firestore and every client renders from its listeners. There is no bespoke sync server: the database's real-time listeners are the transport, and anonymous Firebase auth gets a participant into a session with zero signup friction.",
        "Access is host-gated: joining a session code puts you in a waiting state until the host approves, and the host chooses per-participant draw or watch-only rights.",
      ],
      rejected:
        "A custom WebSocket server was rejected for v1 — it adds an always-on process to host, reconnect logic to write, and an ordering protocol to design, all of which Firestore listeners already provide at whiteboard-scale traffic.",
    },
    metrics: [
      { label: "cursor sync", value: "live, every participant" },
      { label: "session codes", value: "5 characters" },
      { label: "join flow", value: "host approval required" },
      { label: "roles", value: "draw / watch-only" },
    ],
    metricsNote:
      "No sync-latency benchmark is published in the repo, so none is claimed here. Open two windows on the live demo and move a cursor — that is the measurement you can run yourself.",
    limitations: [
      {
        tag: "no metrics",
        body: "The repo publishes no quantified sync-latency numbers. This page states none.",
      },
      {
        tag: "firestore costs",
        body: "Every cursor move is a document write; heavy sessions spend Firestore quota fast. Fine for a demo, not priced for scale.",
      },
      {
        tag: "in-browser babel",
        body: "The frontend transpiles JSX in the browser — a deliberate single-file simplicity trade that costs startup time.",
      },
    ],
  },
  {
    slug: "lecturefind",
    number: "04",
    title: "LectureFind",
    oneLiner: "Search a concept inside a YouTube lecture and jump to it.",
    headlineMetric: "wordnet expansion · 45s clustering",
    thumb: "/thumbs/lecturefind.png",
    repo: "https://github.com/AnshadityaSharma/video_summariser",
    problem:
      "Finding one concept in a 90-minute lecture means scrubbing. The transcript already knows where it is — the problem is that lecturers rarely use your exact word for it.",
    decision: {
      heading: "wordnet expansion over embeddings",
      body: [
        "Queries expand through NLTK's WordNet before matching: 'learning' also searches 'acquisition' and 'scholarship'. Consecutive matches within a 45-second window merge into one time range, so a mentioned-for-two-minutes topic is one result, not forty timestamps.",
        "When nothing matches, the backend extracts the 50 most frequent non-stopword terms from the transcript and ranks them by Wu-Palmer similarity to the query — so instead of an empty page you get the topics that are actually in the video, nearest-first.",
      ],
      rejected:
        "Embedding search over transcript chunks was rejected for v1: it needs a vector store and model inference per query, and its failure mode is plausible-but-wrong matches. WordNet is transparent — every expansion is inspectable — and runs free on CPU.",
    },
    metrics: [
      { label: "match clustering", value: "45-second windows" },
      { label: "synonym source", value: "wordnet (nltk)" },
      { label: "no-match fallback", value: "top 50 terms, wu-palmer ranked" },
      { label: "surfaces", value: "site + chrome extension (mv3)" },
    ],
    metricsNote:
      "No retrieval-precision benchmark is published in the repo, so none is claimed.",
    limitations: [
      {
        tag: "captions required",
        body: "Videos without subtitles are unsearchable — the transcript is the index.",
      },
      {
        tag: "exact phrases",
        body: "Multi-word concepts need exact phrase matches; expansion is per-word.",
      },
      {
        tag: "not deployed",
        body: "Runs locally (FastAPI + React). No hosted demo yet; the repo runs in a few commands.",
      },
    ],
  },
  {
    slug: "hand-cricket",
    number: "05",
    title: "Hand cricket",
    oneLiner: "The playground game, played against a webcam.",
    headlineMetric: "mediapipe gestures · adaptive ai",
    thumb: "/thumbs/hand-cricket.png",
    repo: "https://github.com/AnshadityaSharma/odd_eve",
    live: "https://odd-eve.onrender.com/",
    problem:
      "Hand cricket is a prediction duel: if the bowler can guess your next number, you're out. That makes the AI the whole game — a random opponent is boring, a psychic one is unfair.",
    decision: {
      heading: "a blend of three cheap models over one heavy one",
      body: [
        "The opponent is a weighted blend: Markov chains at 50% (which number follows which — a 3 after your 5), frequency analysis at 30% (your favourite numbers), and recency bias at 20% (your last 8 throws). Each model is transparent and updates online after every ball.",
        "Gestures come from MediaPipe hand tracking: 1–5 extended fingers map to runs, a fist is 10. The camera starts only on an explicit click, never automatically.",
      ],
      rejected:
        "A single learned model (an RNN over throw history) was rejected: it needs training data the first-time player hasn't generated yet, and it can't explain why it bowled what it bowled. The blend is strong from ball one and every prediction is inspectable.",
    },
    metrics: [
      { label: "markov chains", value: "50% weight" },
      { label: "frequency analysis", value: "30% weight" },
      { label: "recency bias", value: "last 8 throws · 20%" },
      { label: "gestures", value: "1–5 fingers + fist = 10" },
    ],
    metricsNote:
      "No win-rate series is published in the repo. Play ten predictable balls on the live demo and the AI's habit-tracking is the measurement.",
    limitations: [
      {
        tag: "camera consent",
        body: "The camera never starts automatically — an explicit click, on the site itself.",
      },
      {
        tag: "cold start",
        body: "Hosted on Render's free tier, which sleeps when idle; the first load after a quiet period can take ~45 seconds.",
      },
      {
        tag: "lighting",
        body: "Hand tracking is MediaPipe's — poor light or a busy background degrades gesture reads.",
      },
    ],
  },
  {
    slug: "rover",
    number: "06",
    title: "VLM-controlled rover",
    oneLiner: "A rover that sees and drives through a vision-language model.",
    headlineMetric: "esp32-cam + gemini vision",
    thumb: "/thumbs/rover.png",
    problem:
      "Can a general vision-language model close a real control loop on cheap hardware — an ESP32-CAM streaming frames up, Gemini Vision returning driving commands — where latency and ambiguity punish you in ways a simulator never does? This is my final-year project.",
    decision: {
      heading: "a hosted VLM over an on-device model",
      body: [
        "The ESP32-CAM has nowhere near the compute to run a vision model itself, so frames go up to Gemini Vision and driving commands come back. The decision was to accept the network round-trip as the price of using a model far larger than anything that fits on the board — and to design the control loop around that latency rather than pretend it away.",
      ],
      rejected:
        "A tiny on-device classifier (TinyML on the ESP32) was rejected for v1: it fits the latency budget but not the ambiguity. A general VLM can be told, in words, what to look for and how to react, without collecting and labelling a bespoke dataset first.",
    },
    metrics: [
      { label: "camera", value: "esp32-cam" },
      { label: "model", value: "gemini vision" },
      { label: "status", value: "final-year project · in progress" },
    ],
    metricsNote:
      "No measured numbers are claimed until the repo and research report are public. That is deliberate — a fake benchmark is the one thing that can cost an offer.",
    limitations: [
      {
        tag: "repo pending",
        body: "Code and the research report are not yet pushed. Until they are, this is a claim — which is why it says so.",
      },
      {
        tag: "loop latency",
        body: "Every decision is a network round-trip to a hosted model; the control loop is designed around that delay, not free of it.",
      },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
