import { evoBestFitness } from "./metrics";

export type DemoKind =
  | "engine" /* in-browser matching engine + optional live WS   */
  | "iframe" /* deployed site, lazy-embedded                    */
  | "camera" /* deployed site behind an explicit start click    */
  | "video" /* hardware — recorded footage is the demo          */
  | "local"; /* runs locally only — honest offline treatment    */

export interface Project {
  slug: string;
  number: string;
  title: string;
  /* two lines max on the homepage */
  description: string;
  demo: DemoKind;
  demoUrl?: string;
  /* static strip data — only where a real measured series exists */
  strip?: number[];
  stripCaption?: string;
  /* static mono metric line (live demos override this at runtime) */
  metricLine: string;
  repo?: string;
  live?: string;
  /* ---- detail page ---- */
  problem: string;
  decision: { heading: string; body: string[]; rejected: string };
  evidence: { label: string; value: string }[];
  evidenceNote?: string;
  limitations: { tag: string; body: string }[];
}

export const projects: Project[] = [
  {
    slug: "exchange",
    number: "01",
    title: "Trading exchange simulator",
    description:
      "A price-time-priority matching engine written from scratch — no library does the interesting work. The order book above is the same engine design, matching and measuring itself in your browser.",
    demo: "engine",
    metricLine: "bench p99 submit 1.2µs · 2,103,613 ops/sec mean",
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
    evidence: [
      { label: "throughput, mean", value: "2,103,613 ops/sec" },
      { label: "submit p50", value: "300ns" },
      { label: "submit p99", value: "1.20µs" },
      { label: "deep book (±5000 ticks) p99", value: "2.30µs" },
      { label: "deep book throughput", value: "1,475,921 ops/sec" },
      { label: "full http path", value: "1,306 orders/sec sustained" },
    ],
    evidenceNote:
      "100× more price levels moved p99 from 1.5µs to 2.3µs and throughput stayed above 1.4M ops/sec — the direct experiment that justifies the array over the tree.",
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
    description:
      "Segmented worms evolve locomotion from nothing — no scripted motion. Selection, crossover and annealed mutation over a 19-gene central-pattern-generator brain.",
    demo: "iframe",
    demoUrl: "https://evocreatures.vercel.app/",
    strip: evoBestFitness,
    stripCaption: "best fitness per generation, 0 → 13.919 over 30 generations",
    metricLine:
      "best fitness 13.919 after 30 generations · ~21m in 8s · forward movers 0% → 42%",
    repo: "https://github.com/AnshadityaSharma/evocreatures",
    live: "https://evocreatures.vercel.app/",
    problem:
      "Can coordinated movement emerge from selection pressure alone? Each creature is seven connected boxes and a 19-gene CPG brain — one shared gait frequency plus amplitude, phase and centre-angle per joint. Nothing tells it how to walk.",
    decision: {
      heading: "offline evolution, replay-only frontend",
      body: [
        "Evolution runs in Python and exports JSON replays per generation; the Three.js frontend only plays them back. The site needs no server-side runtime at all — every gait you scrub through is a recorded, reproducible run, and the fitness history shipping with it is the actual measurement.",
        "The fitness function is fitness = max(0, forward_distance − 0.015·energy − launch_penalty): rightward crawling pays, wasted energy and aerial launches cost. Tournament selection with elitism (top 3 preserved) and Gaussian mutation that anneals from broad to narrow.",
      ],
      rejected:
        "Live in-browser evolution was rejected: it makes results non-reproducible, ties fitness to the viewer's frame rate, and turns a measured claim into a demo effect. The replay JSONs are the evidence.",
    },
    evidence: [
      { label: "best fitness, generation 0", value: "0.000" },
      { label: "best fitness, generation 30", value: "13.919" },
      { label: "distance travelled", value: "~21 metres in 8 seconds" },
      { label: "forward-moving creatures", value: "0% → 42%" },
      { label: "genome", value: "19 genes · cpg brain" },
    ],
    evidenceNote:
      "The strip above is generations[].best from web/replays/history.json in the repo — the committed measurement, not a redrawing of it.",
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
    description:
      "A real-time collaborative whiteboard — shared sessions with 5-character codes, live cursors for every participant, host-approved joining, draw or watch-only roles.",
    demo: "iframe",
    demoUrl: "https://gridspace.vercel.app/",
    metricLine: "live cursors · 5-character session codes · host-gated joins",
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
    evidence: [
      { label: "cursor sync", value: "live, every participant" },
      { label: "session codes", value: "5 characters" },
      { label: "join flow", value: "host approval required" },
      { label: "roles", value: "draw / watch-only" },
    ],
    evidenceNote:
      "No latency benchmark is published in the repo, so none is claimed here. Open two windows on the demo and move a cursor — that is the measurement you can run yourself.",
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
    description:
      "Search a concept inside a YouTube lecture and jump to where it's discussed — WordNet synonym expansion over the transcript, matches clustered into time ranges.",
    demo: "local",
    metricLine:
      "45s clustering window · wordnet expansion · wu-palmer fallback",
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
    evidence: [
      { label: "match clustering", value: "45-second windows" },
      { label: "synonym source", value: "wordnet (nltk)" },
      { label: "no-match fallback", value: "top 50 terms, wu-palmer ranked" },
      { label: "surfaces", value: "site + chrome extension (mv3)" },
    ],
    evidenceNote:
      "No retrieval-precision benchmark is published in the repo, so none is claimed — and this slot carries no strip for the same reason.",
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
        body: "Runs locally (FastAPI + React). This slot is honest about that: no live embed until it's hosted.",
      },
    ],
  },
  {
    slug: "hand-cricket",
    number: "05",
    title: "Hand cricket",
    description:
      "The playground game, played against a webcam — MediaPipe reads 1–5 fingers or a fist for 10, and an adaptive AI learns your throwing habits as you play.",
    demo: "camera",
    demoUrl: "https://odd-eve.onrender.com/",
    metricLine: "markov 50% · frequency 30% · recency 20% · fist = 10",
    repo: "https://github.com/AnshadityaSharma/odd_eve",
    live: "https://odd-eve.onrender.com/",
    problem:
      "Hand cricket is a prediction duel: if the bowler can guess your next number, you're out. That makes the AI the whole game — a random opponent is boring, a psychic one is unfair.",
    decision: {
      heading: "a blend of three cheap models over one heavy one",
      body: [
        "The opponent is a weighted blend: Markov chains at 50% (which number follows which — a 3 after your 5), frequency analysis at 30% (your favourite numbers), and recency bias at 20% (your last 8 throws). Each model is transparent and updates online after every ball.",
        "Gestures come from MediaPipe hand tracking: 1–5 extended fingers map to runs, a fist is 10. The camera starts only when you start it.",
      ],
      rejected:
        "A single learned model (an RNN over throw history) was rejected: it needs training data the first-time player hasn't generated yet, and it can't explain why it bowled what it bowled. The blend is strong from ball one and every prediction is inspectable.",
    },
    evidence: [
      { label: "markov chains", value: "50% weight" },
      { label: "frequency analysis", value: "30% weight" },
      { label: "recency bias", value: "last 8 throws · 20%" },
      { label: "gestures", value: "1–5 fingers + fist = 10" },
    ],
    evidenceNote:
      "No win-rate series is published in the repo, so this slot carries no strip. Play ten balls predictably and the AI's habit-tracking is the measurement.",
    limitations: [
      {
        tag: "camera consent",
        body: "The demo never auto-requests the webcam — it starts on an explicit click, here and on the site itself.",
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
    description:
      "A ground rover driven by a vision-language model — frames go up, driving commands come back. Hardware can't be iframed; footage of it driving is the demo.",
    demo: "video",
    metricLine: "hardware · recorded footage is the demo",
    problem:
      "Can a vision-language model close a real control loop — camera frames in, motor commands out — on hardware that punishes latency and ambiguity in a way a simulator never does?",
    decision: {
      heading: "the demo is the footage",
      body: [
        "A robot cannot run inside a web page, and pretending otherwise with a canned animation would be a fake demo. The honest artifact is video of the physical rover executing commands, treated here exactly like the live slots: the recording is the exhibit.",
      ],
      rejected:
        "A simulated stand-in rover was rejected outright — a fake demo is the one thing on a portfolio that can cost an offer.",
    },
    evidence: [{ label: "status", value: "repo + research report being prepared" }],
    evidenceNote:
      "This slot makes no measured claims until the repo and report are public. That is deliberate.",
    limitations: [
      {
        tag: "repo pending",
        body: "Code and the research report are not yet pushed. Until they are, this slot is a claim — which is why it says so.",
      },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
