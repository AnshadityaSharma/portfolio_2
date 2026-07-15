"use client";

/* The left rail — the site's only primary nav. Sticky vertical mono
   column on desktop, a horizontal scroll strip on mobile. Scroll-spied:
   the section in view is ink, the rest graphite. Holds the name at the
   top and the resume link at the foot, so it is self-sufficient. */

import { useEffect, useState } from "react";
import Link from "next/link";

const SECTIONS: { id: string; label: string }[] = [
  { id: "about", label: "about" },
  { id: "build", label: "what i build" },
  { id: "work", label: "work" },
  { id: "stack", label: "stack" },
  { id: "trajectory", label: "trajectory" },
  { id: "contact", label: "contact" },
];

export default function Rail() {
  const [active, setActive] = useState<string>("about");

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <aside className="md:sticky md:top-10 md:h-fit md:w-[150px] md:flex-none">
      <div className="flex items-center gap-4 overflow-x-auto md:flex-col md:items-start md:gap-0">
        <Link
          href="/"
          className="mb-0 shrink-0 font-mono text-meta font-medium text-signal md:mb-7"
        >
          ansh sharma
        </Link>

        <nav className="flex shrink-0 gap-4 font-mono text-meta md:flex-col md:gap-3.5">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={active === s.id ? "true" : undefined}
              className={
                active === s.id
                  ? "whitespace-nowrap font-medium text-ink"
                  : "whitespace-nowrap text-graphite hover:text-ink"
              }
            >
              {s.label}
            </a>
          ))}
        </nav>

        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 whitespace-nowrap font-mono text-meta text-graphite hover:text-ink md:mt-7"
        >
          resume ↗
        </a>
      </div>
    </aside>
  );
}
