"use client";

/* Slot 01 / the cold-open hero. Not an iframe (build step 6).

   Two modes, labelled honestly:
   - "live"    — read-only WebSocket to the deployed Railway engine
                 (NEXT_PUBLIC_EXCHANGE_WS_URL), reconnect with backoff.
   - "running" — the same book data structure (lib/engine.ts) matching
                 real order flow in your tab. Once a second it also runs
                 a measured burst through a fresh book and reports the
                 actual mean µs/op — the strip is that measurement.

   Nothing here is a recording. */

import { useEffect, useRef } from "react";
import { Book, benchBurst, seedBook } from "@/lib/engine";
import { publish } from "@/lib/liveStore";
import { useExchangeFeed } from "@/lib/useExchangeFeed";

const SLUG = "exchange";
const N_LEVELS = 8;
const TICK = 1; // integer ticks in the engine
const PX = 100; // ticks → display price divisor

interface Tape {
  price: number;
  qty: number;
  buy: boolean;
  born: number;
}

export default function ExchangeDemo({ height = 620 }: { height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const feed = useExchangeFeed(true);
  const feedRef = useRef(feed);
  feedRef.current = feed;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    /* ---- local engine state ---- */
    let book = seedBook(18740, N_LEVELS + 6);
    let mid = 18740;
    const tape: Tape[] = [];
    const flash = new Map<number, number>(); // price → expiry ms
    let fills = 0;
    let flowAcc = 0;
    let benchAcc = 0;
    const series: number[] = [];
    let lastMean = 0;
    let lastOps = 0;
    let raf = 0;
    let last = performance.now();
    let w = 0;
    let h = 0;

    const fit = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      w = r.width;
      h = r.height;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(canvas);

    const rnd = Math.random;

    const stepFlow = (now: number) => {
      /* makers refresh quotes around the touch */
      for (let k = 0; k < 3; k++) {
        const side = rnd() < 0.5 ? "bid" : "ask";
        const off = 1 + Math.floor(rnd() * 10);
        const price = side === "bid" ? mid - off * TICK : mid + off * TICK;
        book.submitLimit(side as "bid" | "ask", price, 60 + Math.floor(rnd() * 480));
      }
      /* a taker crosses */
      if (rnd() < 0.82) {
        const buy = rnd() < 0.5;
        const got = book.submitMarket(buy ? "bid" : "ask", 80 + Math.floor(rnd() * 700));
        for (const f of got) {
          fills++;
          flash.set(f.price, now + 240);
          tape.unshift({ price: f.price, qty: f.qty, buy: f.takerBuy, born: now });
        }
        if (tape.length > 11) tape.length = 11;
      }
      const bb = book.bestBid();
      const ba = book.bestAsk();
      if (bb !== null && ba !== null) mid = Math.round((bb + ba) / 2);
      /* keep the book alive if a side thins out */
      if (book.depth("bid", 1).length === 0 || book.depth("ask", 1).length === 0) {
        book = seedBook(mid, N_LEVELS + 6);
      }
    };

    const runBench = () => {
      const { meanUs, opsPerSec } = benchBurst(4000);
      lastMean = meanUs;
      lastOps = opsPerSec;
      series.push(meanUs);
      if (series.length > 220) series.shift();
      const live = feedRef.current.mode === "live";
      publish(SLUG, {
        status: live ? "live" : "running",
        series: [...series],
        metricLine: `in-browser mean ${meanUs.toFixed(2)}µs/op · ${opsPerSec.toLocaleString()} ops/s · ${fills.toLocaleString()} fills — repo bench p99 1.2µs`,
      });
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      const live = feedRef.current.mode === "live";

      /* choose the data source: WS book or local engine */
      let bids: { price: number; total: number }[];
      let asks: { price: number; total: number }[];
      let shownTape: Tape[];
      if (live) {
        bids = feedRef.current.bids.slice(0, N_LEVELS);
        asks = feedRef.current.asks.slice(0, N_LEVELS);
        shownTape = feedRef.current.trades.map((t) => ({
          price: t.price,
          qty: t.qty,
          buy: t.buy,
          born: t.at,
        }));
      } else {
        bids = book.depth("bid", N_LEVELS);
        asks = book.depth("ask", N_LEVELS);
        shownTape = tape;
      }

      const rows = N_LEVELS * 2;
      const top = 40;
      const bot = h - 30;
      const rowH = (bot - top) / rows;
      const centerX = w * (w < 640 ? 0.46 : 0.4);
      const priceW = w < 640 ? 62 : 78;
      const maxBar = w * (w < 640 ? 0.24 : 0.32);
      let allMax = 1;
      for (const l of bids) allMax = Math.max(allMax, l.total);
      for (const l of asks) allMax = Math.max(allMax, l.total);

      ctx.textBaseline = "middle";
      for (let r = 0; r < rows; r++) {
        const isAsk = r < N_LEVELS;
        const idx = isAsk ? N_LEVELS - 1 - r : r - N_LEVELS;
        const lvl = isAsk ? asks[idx] : bids[idx];
        if (!lvl) continue;
        const y = top + rowH * (r + 0.5);
        const fl = flash.get(lvl.price);
        const flashing = !reduceMotion && fl !== undefined && fl > now;
        const barLen = (lvl.total / allMax) * maxBar;

        ctx.fillStyle = flashing
          ? "rgba(43,76,255,0.30)"
          : idx === 0
            ? "rgba(18,19,15,0.13)"
            : "rgba(107,108,102,0.11)";
        if (isAsk) ctx.fillRect(centerX + priceW / 2, y - rowH * 0.34, barLen, rowH * 0.68);
        else ctx.fillRect(centerX - priceW / 2 - barLen, y - rowH * 0.34, barLen, rowH * 0.68);

        ctx.font = '500 12px "Commit Mono", ui-monospace, monospace';
        ctx.fillStyle = flashing ? "#2B4CFF" : idx === 0 ? "#12130F" : "#6B6C66";
        ctx.textAlign = "center";
        ctx.fillText((lvl.price / PX).toFixed(2), centerX, y);

        ctx.font = '400 11px "Commit Mono", ui-monospace, monospace';
        ctx.fillStyle = flashing ? "#2B4CFF" : "#6B6C66";
        ctx.textAlign = isAsk ? "left" : "right";
        const st = String(lvl.total | 0);
        if (isAsk) ctx.fillText(st, centerX + priceW / 2 + barLen + 6, y);
        else ctx.fillText(st, centerX - priceW / 2 - barLen - 6, y);
      }

      /* mid rail */
      const midY = top + rowH * N_LEVELS;
      ctx.strokeStyle = "#D8D8D2";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX - priceW / 2 - maxBar, midY);
      ctx.lineTo(centerX - priceW / 2 - 44, midY);
      ctx.moveTo(centerX + priceW / 2 + 44, midY);
      ctx.lineTo(centerX + priceW / 2 + maxBar, midY);
      ctx.stroke();
      ctx.font = '500 13px "Commit Mono", ui-monospace, monospace';
      ctx.fillStyle = "#12130F";
      ctx.textAlign = "center";
      ctx.fillText((mid / PX).toFixed(2), centerX, midY);

      /* the tape */
      const tapeX = w - 8;
      ctx.textAlign = "right";
      ctx.font = '400 11px "Commit Mono", ui-monospace, monospace';
      ctx.fillStyle = "#6B6C66";
      ctx.fillText("tape", tapeX, top - 14);
      for (let i = 0; i < shownTape.length; i++) {
        const t = shownTape[i];
        const y = top + 6 + i * 20;
        if (y > bot) break;
        const fresh = !reduceMotion && now - t.born < 320;
        ctx.fillStyle = fresh ? "#2B4CFF" : i < 3 ? "#12130F" : "#6B6C66";
        ctx.fillText((t.price / PX).toFixed(2) + "  " + (t.qty | 0), tapeX, y);
      }

      /* mode caption, bottom-left, mono micro */
      ctx.textAlign = "left";
      ctx.font = '400 10px "Commit Mono", ui-monospace, monospace';
      ctx.fillStyle = "#6B6C66";
      ctx.fillText(
        live
          ? "live feed — read-only websocket to the deployed engine"
          : `matching in your browser — mean ${lastMean.toFixed(2)}µs/op · ${lastOps.toLocaleString()} ops/s`,
        10,
        h - 12,
      );
    };

    const FLOW_MS = reduceMotion ? 1000 : 85;
    const tick = (now: number) => {
      const dt = Math.min(200, now - last);
      last = now;
      if (feedRef.current.mode !== "live") {
        flowAcc += dt;
        while (flowAcc > FLOW_MS) {
          flowAcc -= FLOW_MS;
          stepFlow(now);
        }
      }
      benchAcc += dt;
      if (benchAcc >= 1000) {
        benchAcc = 0;
        runBench();
      }
      draw(now);
      raf = requestAnimationFrame(tick);
    };

    publish(SLUG, { status: "running" });
    runBench();
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="relative w-full" style={{ height: `min(${height}px, 78vh)` }}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
