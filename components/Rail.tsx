"use client";

/* The only nav: 01–06 down the left edge, scroll-spied. Collapses to a
   horizontal mono row under 768px. Active number is ink, rest graphite —
   no signal here; navigation is not alive. */

import { useEffect, useState } from "react";

const NUMBERS = ["01", "02", "03", "04", "05", "06"];

export default function Rail({ active: activeProp }: { active?: string }) {
  const [active, setActive] = useState(activeProp ?? "01");

  useEffect(() => {
    if (activeProp) return; // detail pages fix the active number
    const sections = NUMBERS.map((n) => document.getElementById(`p-${n}`)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id.replace("p-", ""));
        }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [activeProp]);

  return (
    <nav
      aria-label="projects"
      className="flex gap-[18px] font-mono text-meta md:sticky md:top-14 md:w-11 md:flex-col"
    >
      {NUMBERS.map((n) => (
        <a
          key={n}
          href={activeProp ? `/#p-${n}` : `#p-${n}`}
          aria-current={active === n ? "true" : undefined}
          className={active === n ? "font-medium text-ink" : "text-graphite"}
        >
          {n}
        </a>
      ))}
    </nav>
  );
}
