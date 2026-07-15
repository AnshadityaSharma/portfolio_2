# ansh-portfolio

White-cube portfolio for Anshaditya Sharma — CS @ VIT Chennai '27, SDE roles.
Standard structure done carefully: hero → about → skills → six project cards →
achievements → contact, with a detail page per project that carries the real
engineering (the problem, the one non-obvious decision + what was rejected,
metrics labelled with how they were measured, honest limitations).

Design system (see `brief.md` in the parent folder): six colour tokens, type
scale 48/28/18/16/13/11, weights 400/500 only, sentence case, mono for all
numbers and labels. Blue `#2B4CFF` is a normal accent, used sparingly on links
and headings.

## run

```bash
npm install
npm run dev
```

## deploy (vercel)

```bash
npx vercel
```

Set `NEXT_PUBLIC_SITE_URL` to the deployed URL so OG images resolve.

## things only you can add

- `public/resume.pdf` — already present; replace to update
- `public/thumbs/<slug>.png` — card thumbnails (exchange, evocreatures,
  gridspace, lecturefind, hand-cricket, rover). Until added, each card shows a
  clean shelf-coloured well with the project number — never a broken image.
- Uncut Sans woff2s — the display font falls back to Instrument Sans until the
  files land in `public/fonts/` with matching `@font-face` rules in
  `app/globals.css`. Uncut Sans is a free download from uncut.wtf.

## honesty rules (kept from brief.md)

- every number is sourced from the repos — nothing invented (`data/projects.ts`)
- metrics say how they were measured (exchange = the benchmark harness; the
  evocreatures figures are `history.json`'s committed run)
- where a repo publishes no benchmark, the page says so rather than inventing one
- rover states plainly that its repo and report are still being prepared
