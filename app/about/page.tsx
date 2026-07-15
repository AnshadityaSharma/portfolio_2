import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About — Anshaditya Sharma",
  description:
    "CS at VIT Chennai '27. I build systems that have to run in real time.",
};

export default function About() {
  return (
    <div className="mx-auto max-w-[1080px] px-6 py-10 sm:px-10 md:py-14">
      <div className="flex flex-col gap-8 md:flex-row md:gap-11">
        <div className="font-mono text-meta md:w-11">
          <Link href="/" className="text-graphite">
            ← work
          </Link>
        </div>

        <main className="min-w-0 flex-1">
          <h1 className="font-display text-display font-medium text-ink">
            About
          </h1>

          <div className="mt-10 flex max-w-[640px] flex-col gap-5 text-body text-ink">
            <p>
              I&apos;m Anshaditya — a CS undergraduate at VIT Chennai,
              graduating in 2027, and I build systems that have to run in
              real time: a matching engine measured in nanoseconds, evolution
              you can watch converge, canvases that stay consistent across
              everyone touching them.
            </p>
            <p>
              The rule this site is built on: every project runs, and every
              project measures itself. If a number appears anywhere on these
              pages, it came out of a benchmark, a committed results file, or
              the demo in front of you — never out of my head.
            </p>
            <p className="text-graphite">
              The same rule cuts the other way: where a repo publishes no
              metric, no metric is claimed, and the limitations sections say
              what actually breaks — crash-loss windows, cold starts, free
              tiers that sleep. Stating that unprompted is, I think, the most
              useful signal a portfolio can send.
            </p>
          </div>

          <div className="mt-12 flex gap-[26px] text-body">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-ink pb-0.5 text-ink"
            >
              resume ↗
            </a>
            <a
              href="https://github.com/AnshadityaSharma"
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-ink pb-0.5 text-ink"
            >
              github ↗
            </a>
            <a
              href="mailto:anshadityasharma23@gmail.com"
              className="border-b border-rule pb-0.5 text-graphite"
            >
              email ↗
            </a>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}
