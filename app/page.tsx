/* Homepage — the design's 1a screen: cold-open hero (project 01's live
   order book, full bleed, before any text), then identity, then the six
   project blocks in a single column. */

import CameraGate from "@/components/CameraGate";
import ExchangeDemo from "@/components/ExchangeDemo";
import Footer from "@/components/Footer";
import LazyEmbed from "@/components/LazyEmbed";
import ProjectSlot from "@/components/ProjectSlot";
import Rail from "@/components/Rail";
import Reveal from "@/components/Reveal";
import RoverVideo from "@/components/RoverVideo";
import { projects } from "@/data/projects";
import type { SlotStatus } from "@/lib/liveStore";

function demoFor(slug: string): React.ReactNode {
  const p = projects.find((x) => x.slug === slug)!;
  switch (p.demo) {
    case "engine":
      return <ExchangeDemo />;
    case "iframe":
      return (
        <LazyEmbed slug={p.slug} src={p.demoUrl!} title={p.title} height={560} />
      );
    case "camera":
      return <CameraGate slug={p.slug} src={p.demoUrl!} title={p.title} height={560} />;
    case "video":
      return <RoverVideo slug={p.slug} height={560} />;
    case "local":
      return (
        <div className="relative flex w-full flex-col items-center justify-center gap-3 bg-shelf p-6 text-center" style={{ height: "min(400px, 60vh)" }}>
          <div className="font-mono text-meta text-graphite">
            ● local only — fastapi + react, not yet hosted
          </div>
          <a
            href={p.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-ink pb-0.5 text-body text-ink"
          >
            run it from the repo ↗
          </a>
        </div>
      );
  }
}

const INITIAL_STATUS: Record<string, SlotStatus> = {
  exchange: "running",
  evocreatures: "connecting",
  gridspace: "connecting",
  lecturefind: "local",
  "hand-cricket": "gated",
  rover: "recorded",
};

export default function Home() {
  const [first, ...rest] = projects;
  return (
    <div className="mx-auto max-w-[1080px] px-6 py-10 sm:px-10 md:py-14">
      <div className="flex flex-col gap-8 md:flex-row md:gap-11">
        <Rail />

        <main className="min-w-0 flex-1">
          {/* cold-open: project 01's demo IS the hero — no text first */}
          <div className="bg-shelf">
            <ExchangeDemo height={660} />
          </div>

          {/* identity, only after the book */}
          <Reveal>
            <header className="py-24 md:py-[104px]">
              <h1 className="font-display text-title font-medium text-ink">
                anshaditya sharma
              </h1>
              <p className="mt-2.5 font-mono text-meta text-graphite">
                cs @ vit chennai &apos;27 · systems + real-time software
              </p>
              <p className="mt-8 max-w-[560px] text-lead text-graphite">
                Six projects. Every one of them runs — live in this page, or
                as footage of real hardware. Nothing is a screenshot, and
                every number on this page is measured, not written.
              </p>
            </header>
          </Reveal>

          {/* project 01 — its demo is the hero above */}
          <Reveal>
            <ProjectSlot
              project={first}
              demoAbove
              initialStatus={INITIAL_STATUS[first.slug]}
            />
          </Reveal>

          {/* projects 02–06 */}
          <div className="mt-28 flex flex-col gap-28 md:mt-36 md:gap-36">
            {rest.map((p) => (
              <Reveal key={p.slug}>
                <ProjectSlot
                  project={p}
                  demo={demoFor(p.slug)}
                  initialStatus={INITIAL_STATUS[p.slug]}
                />
              </Reveal>
            ))}
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}
