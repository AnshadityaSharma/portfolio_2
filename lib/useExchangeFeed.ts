"use client";

/* Read-only WebSocket client for the deployed exchange (step 6).
   - never sends orders: subscribe-only
   - per-channel sequence gap detection (docs/decisions.md D12)
   - exponential backoff with jitter, capped
   - reports status up; the caller falls back to the in-browser engine

   The endpoint comes from NEXT_PUBLIC_EXCHANGE_WS_URL. When unset the
   hook stays idle and the demo runs the local engine — labelled as such. */

import { useEffect, useRef, useState } from "react";

export interface BookLevel {
  price: number;
  total: number;
}

export interface FeedState {
  mode: "idle" | "connecting" | "live" | "down";
  bids: BookLevel[];
  asks: BookLevel[];
  trades: { price: number; qty: number; buy: boolean; at: number }[];
}

const WS_URL = process.env.NEXT_PUBLIC_EXCHANGE_WS_URL;
const SYMBOL = process.env.NEXT_PUBLIC_EXCHANGE_SYMBOL ?? "SIM";
const MAX_BACKOFF_MS = 30_000;
const MAX_ATTEMPTS = 5;

export function useExchangeFeed(enabled: boolean): FeedState {
  const [state, setState] = useState<FeedState>({
    mode: WS_URL ? "connecting" : "idle",
    bids: [],
    asks: [],
    trades: [],
  });
  const seqs = useRef<Record<string, number>>({});
  const attempts = useRef(0);

  useEffect(() => {
    if (!enabled || !WS_URL) return;

    let ws: WebSocket | null = null;
    let closed = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      if (closed) return;
      setState((s) => ({ ...s, mode: "connecting" }));
      try {
        ws = new WebSocket(WS_URL);
      } catch {
        scheduleRetry();
        return;
      }

      ws.onopen = () => {
        attempts.current = 0;
        seqs.current = {};
        /* read-only: subscribe to the public channels, nothing else */
        ws?.send(
          JSON.stringify({
            op: "subscribe",
            channels: [`book:${SYMBOL}`, `trades:${SYMBOL}`],
          }),
        );
        setState((s) => ({ ...s, mode: "live" }));
      };

      ws.onmessage = (ev) => {
        let msg: {
          channel?: string;
          seq?: number;
          bids?: [number, number][];
          asks?: [number, number][];
          price?: number;
          qty?: number;
          side?: string;
        };
        try {
          msg = JSON.parse(ev.data as string);
        } catch {
          return;
        }
        const ch = msg.channel;
        if (!ch) return;
        /* gap detection per channel — on a gap, resubscribe for a snapshot */
        if (typeof msg.seq === "number") {
          const prev = seqs.current[ch];
          if (prev !== undefined && msg.seq !== prev + 1) {
            ws?.send(JSON.stringify({ op: "subscribe", channels: [ch] }));
            seqs.current = { ...seqs.current, [ch]: msg.seq };
            return;
          }
          seqs.current[ch] = msg.seq;
        }
        if (ch.startsWith("book:") && msg.bids && msg.asks) {
          setState((s) => ({
            ...s,
            bids: msg.bids!.map(([price, total]) => ({ price, total })),
            asks: msg.asks!.map(([price, total]) => ({ price, total })),
          }));
        } else if (ch.startsWith("trades:") && typeof msg.price === "number") {
          setState((s) => ({
            ...s,
            trades: [
              {
                price: msg.price!,
                qty: msg.qty ?? 0,
                buy: msg.side === "buy",
                at: Date.now(),
              },
              ...s.trades,
            ].slice(0, 12),
          }));
        }
      };

      ws.onclose = () => scheduleRetry();
      ws.onerror = () => ws?.close();
    };

    const scheduleRetry = () => {
      if (closed) return;
      attempts.current += 1;
      if (attempts.current > MAX_ATTEMPTS) {
        setState((s) => ({ ...s, mode: "down" }));
        return;
      }
      const base = Math.min(MAX_BACKOFF_MS, 1000 * 2 ** attempts.current);
      const jitter = base * (0.5 + Math.random() * 0.5);
      timer = setTimeout(connect, jitter);
    };

    connect();
    return () => {
      closed = true;
      if (timer) clearTimeout(timer);
      ws?.close();
    };
  }, [enabled]);

  return state;
}
