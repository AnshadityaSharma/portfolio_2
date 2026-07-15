/* A real price-time-priority matching engine, in the browser.
   Same design as the repo's engine (docs/decisions.md D1/D2/D6):
   integer ticks only, hashmap + sorted price array with best at the end,
   FIFO queue per level, engine-assigned ids, no wall-clock in the match path.

   This is not a recording of the Railway engine — it is the same data
   structure doing real matching work in your tab, and the µs/op number
   shown next to it is measured here with performance.now(). */

export interface Fill {
  price: number; // ticks
  qty: number;
  takerBuy: boolean;
}

interface Order {
  id: number;
  qty: number;
}

interface Level {
  price: number;
  total: number;
  queue: Order[];
  head: number; // index of first live order — O(1) pop without shift()
}

export type Side = "bid" | "ask";

export class Book {
  /* sorted ascending; best bid = end of bids, best ask = start of asks
     kept as: bids ascending (best at end), asks descending (best at end)
     so both sides pop their best in O(1) from the end. */
  private bids: Level[] = [];
  private asks: Level[] = [];
  private levelIndex = new Map<string, Level>();
  private nextId = 1;
  fills = 0;

  private key(side: Side, price: number): string {
    return side + ":" + price;
  }

  bestBid(): number | null {
    return this.bids.length ? this.bids[this.bids.length - 1].price : null;
  }
  bestAsk(): number | null {
    return this.asks.length ? this.asks[this.asks.length - 1].price : null;
  }

  /* top n levels from best outward: [{price, total}] */
  depth(side: Side, n: number): { price: number; total: number }[] {
    const arr = side === "bid" ? this.bids : this.asks;
    const out: { price: number; total: number }[] = [];
    for (let i = arr.length - 1; i >= 0 && out.length < n; i--) {
      out.push({ price: arr[i].price, total: arr[i].total });
    }
    return out;
  }

  private insertLevel(side: Side, price: number): Level {
    const level: Level = { price, total: 0, queue: [], head: 0 };
    const arr = side === "bid" ? this.bids : this.asks;
    /* bids ascending, asks descending — binary search insert (O(L) splice,
       contiguous memmove: the D2 trade) */
    let lo = 0,
      hi = arr.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      const cmp = side === "bid" ? arr[mid].price < price : arr[mid].price > price;
      if (cmp) lo = mid + 1;
      else hi = mid;
    }
    arr.splice(lo, 0, level);
    this.levelIndex.set(this.key(side, price), level);
    return level;
  }

  private dropBest(side: Side): void {
    const arr = side === "bid" ? this.bids : this.asks;
    const lvl = arr.pop();
    if (lvl) this.levelIndex.delete(this.key(side, lvl.price));
  }

  /* limit order: match while crossing, rest remainder. Returns fills. */
  submitLimit(side: Side, price: number, qty: number): Fill[] {
    const fills = this.match(side, qty, price);
    const remaining = qty - fills.reduce((s, f) => s + f.qty, 0);
    if (remaining > 0) {
      const k = this.key(side, price);
      const level = this.levelIndex.get(k) ?? this.insertLevel(side, price);
      level.queue.push({ id: this.nextId++, qty: remaining });
      level.total += remaining;
    }
    return fills;
  }

  /* market order: match, cancel remainder (D4 — IOC semantics). */
  submitMarket(side: Side, qty: number): Fill[] {
    return this.match(side, qty, null);
  }

  private match(taker: Side, qty: number, limit: number | null): Fill[] {
    const fills: Fill[] = [];
    const opp = taker === "bid" ? this.asks : this.bids;
    while (qty > 0 && opp.length > 0) {
      const best = opp[opp.length - 1];
      if (limit !== null) {
        if (taker === "bid" ? best.price > limit : best.price < limit) break;
      }
      while (qty > 0 && best.head < best.queue.length) {
        const maker = best.queue[best.head];
        const take = Math.min(qty, maker.qty);
        maker.qty -= take;
        best.total -= take;
        qty -= take;
        this.fills++;
        /* execution at the maker's price (D3) */
        fills.push({ price: best.price, qty: take, takerBuy: taker === "bid" });
        if (maker.qty === 0) best.head++;
      }
      if (best.head >= best.queue.length && best.total <= 0) {
        this.dropBest(taker === "bid" ? "ask" : "bid");
      } else if (qty > 0) {
        break;
      }
    }
    return fills;
  }
}

/* ------------------------------------------------------------------ *
 * Seeded book + deterministic-ish flow for the visible demo and the
 * hot measurement lane.
 * ------------------------------------------------------------------ */

export function seedBook(mid: number, levels: number): Book {
  const b = new Book();
  for (let i = 1; i <= levels; i++) {
    b.submitLimit("bid", mid - i, 300 + ((i * 137) % 900));
    b.submitLimit("ask", mid + i, 300 + ((i * 211) % 900));
  }
  return b;
}

/* Run a burst of mixed flow (≈70% limit / 30% market — the repo bench
   is 70/10/20 with cancels; cancels are omitted here) against a fresh
   book and measure mean wall time per op in µs. Browser timers are
   coarsened, so we measure the batch, not each op — the mean is real. */
export function benchBurst(ops: number): { meanUs: number; opsPerSec: number } {
  const book = seedBook(10000, 40);
  let x = 123456789; // xorshift32, like the repo bench (D9)
  const rnd = () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
  const t0 = performance.now();
  for (let i = 0; i < ops; i++) {
    const r = rnd();
    const side: Side = rnd() < 0.5 ? "bid" : "ask";
    if (r < 0.7) {
      const off = 1 + Math.floor(rnd() * 12);
      const price = side === "bid" ? 10000 - off : 10000 + off;
      book.submitLimit(side, price, 50 + Math.floor(rnd() * 400));
    } else {
      book.submitMarket(side, 50 + Math.floor(rnd() * 300));
    }
  }
  const ms = performance.now() - t0;
  return {
    meanUs: (ms * 1000) / ops,
    opsPerSec: ms > 0 ? Math.round(ops / (ms / 1000)) : 0,
  };
}
