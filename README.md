# ansh-portfolio

White-cube portfolio: six projects, every one running live on the page.
Built to `brief.md` — six colour tokens, type scale 48/28/18/16/13/11,
weights 400/500 only, and `--signal #2B4CFF` reserved exclusively for
things that are alive.

## run

```bash
npm install
npm run dev
```

## deploy (vercel)

```bash
npx vercel
```

Set in the Vercel project:

- `NEXT_PUBLIC_SITE_URL` — the deployed url (for og images)
- `NEXT_PUBLIC_EXCHANGE_WS_URL` — optional; the exchange's read-only ws
  feed. **Rate-limit it and confirm it is read-only before going public**
  (brief.md, open task 2). Without it, slot 01 runs the in-browser engine.

## things only you can add

- `public/resume.pdf` — the footer links to it
- `public/demos/rover.mp4` — slot 06's footage; until it exists the slot
  states honestly that the repo and report are being prepared
- Uncut Sans woff2s — the display font falls back to Instrument Sans until
  the files are added (Uncut Sans is a free download from uncut.wtf;
  drop `UncutSans-Regular.woff2` + `UncutSans-Medium.woff2` in
  `public/fonts/` and add the two `@font-face` rules in `app/globals.css`)

## honesty rules encoded in the build

- `data/metrics.ts` — every number sourced from the repos; the
  EvoCreatures strip is `generations[].best` from the repo's committed
  `history.json`, not a redrawing
- slots whose repos publish no metric get **no strip** (gridspace,
  lecturefind, hand cricket, rover)
- slot 01's µs/op figure is measured in the visitor's browser with
  `performance.now()` over a real matching burst — `lib/engine.ts` is a
  genuine price-time-priority book (same design as the repo: integer
  ticks, sorted array + fifo levels)
- hand cricket never auto-requests the webcam; the camera starts only
  after an explicit click, inside the game's own origin
