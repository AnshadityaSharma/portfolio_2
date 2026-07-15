"use client";

/* The one scroll treatment: content rises 14px and fades in the first
   time it enters the viewport. Quiet, once, and disabled entirely under
   prefers-reduced-motion (globals.css zeroes transition durations). */

import { useEffect, useRef, useState } from "react";

export default function Reveal({
  children,
  delayMs = 0,
}: {
  children: React.ReactNode;
  delayMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    /* safety net: content must never stay hidden if the observer stalls —
       poll position cheaply and reveal anything already in view */
    const failSafe = setInterval(() => {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        setShown(true);
        clearInterval(failSafe);
      }
    }, 1500);
    return () => {
      io.disconnect();
      clearInterval(failSafe);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(14px)",
        transition: `opacity 0.55s ease-out ${delayMs}ms, transform 0.55s ease-out ${delayMs}ms`,
      }}
    >
      {children}
    </div>
  );
}
