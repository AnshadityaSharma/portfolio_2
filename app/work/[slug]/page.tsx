/* Project detail page (build step 7), following the design's 1b screen:
   mono header row → full-bleed demo → strip → metric line → title →
   architecture (the one decision + what was rejected) → evidence →
   limitations → links. All copy and numbers come from the repos. */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CameraGate from "@/components/CameraGate";
import ExchangeDemo from "@/components/ExchangeDemo";
import FitnessStrip, { LiveFitnessStrip } from "@/components/FitnessStrip";
import Footer from "@/components/Footer";
import LazyEmbed from "@/components/LazyEmbed";
import MetricLine from "@/components/MetricLine";
import Rail from "@/components/Rail";
import RoverVideo from "@/components/RoverVideo";
import StatusBadge from "@/components/StatusBadge";
import { getProject, projects } from "@/data/projects";
import type { SlotStatus } from "@/lib/liveStore";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: `${p.title} — Anshaditya Sharma`,
    description: p.description,
  };
}

const INITIAL_STATUS: Record<string, SlotStatus> = {
  exchange: "running",
  evocreatures: "connecting",
  gridspace: "connecting",
  lecturefind: "local",
  "hand-cricket": "gated",
  rover: "recorded",
};

function Demo({ slug }: { slug: string }) {
  const p = getProject(slug)!;
  switch (p.demo) {
    case "engine":
      return (
        <div className="bg-shelf">
          <ExchangeDemo height={560} />
        </div>
      );
    case "iframe":
      return <LazyEmbed slug={p.slug} src={p.demoUrl!} title={p.title} height={560} />;
    case "camera":
      return <CameraGate slug={p.slug} src={p.demoUrl!} title={p.title} height={560} />;
    case "video":
      return <RoverVideo slug={p.slug} height={560} />;
    case "local":
      return (
        <div
          className="relative flex w-full flex-col items-center justify-center gap-3 bg-shelf p-6 text-center"
          style={{ height: "min(400px, 60vh)" }}
        >
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 font-mono text-micro text-graphite">{children}</div>
  );
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-[1080px] px-6 py-10 sm:px-10 md:py-14">
      <div className="flex flex-col gap-8 md:flex-row md:gap-11">
        <Rail active={project.number} />

        <main className="min-w-0 flex-1">
          {/* mono header row */}
          <div className="flex items-center gap-[18px]">
            <span className="font-mono text-meta font-medium text-ink">
              {project.number}
            </span>
            <span className="h-px flex-1 bg-rule" />
            <StatusBadge slug={project.slug} initial={INITIAL_STATUS[project.slug]} />
          </div>

          {/* the problem — two sentences, before the demo */}
          <p className="mt-8 max-w-[640px] text-lead text-ink">
            {project.problem}
          </p>

          {/* the demo — full width, running */}
          <div className="mt-8">
            <Demo slug={project.slug} />
          </div>

          {/* strip + metric line */}
          {project.demo === "engine" ? (
            <LiveFitnessStrip slug={project.slug} />
          ) : project.strip ? (
            <FitnessStrip data={project.strip} />
          ) : null}
          <MetricLine slug={project.slug} fallback={project.metricLine} />
          {project.stripCaption && (
            <div className="mt-1 font-mono text-micro text-graphite">
              {project.stripCaption}
            </div>
          )}

          <h1 className="mt-7 font-display text-title font-medium text-ink">
            {project.title}
          </h1>
          <p className="mt-3 max-w-[560px] text-body text-graphite">
            {project.description}
          </p>

          {/* architecture — the one decision */}
          <section className="mt-16 max-w-[640px]">
            <SectionLabel>architecture · the one decision</SectionLabel>
            <h2 className="text-body font-medium text-ink">
              {project.decision.heading}
            </h2>
            {project.decision.body.map((para, i) => (
              <p
                key={i}
                className={`mt-4 text-body ${i === 0 ? "text-ink" : "text-graphite"}`}
              >
                {para}
              </p>
            ))}
            <p className="mt-4 text-body text-graphite">
              <span className="font-mono text-meta text-graphite">
                rejected —{" "}
              </span>
              {project.decision.rejected}
            </p>
          </section>

          {/* evidence — the measurement that proves it */}
          <section className="mt-14 border-t border-rule pt-[26px]">
            <SectionLabel>evidence · measured, not written</SectionLabel>
            <div className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3">
              {project.evidence.map((e) => (
                <div key={e.label}>
                  <div className="font-mono text-micro text-graphite">
                    {e.label}
                  </div>
                  <div className="mt-1.5 font-mono text-lead font-medium text-ink">
                    {e.value}
                  </div>
                </div>
              ))}
            </div>
            {project.evidenceNote && (
              <p className="mt-6 max-w-[640px] text-body text-graphite">
                {project.evidenceNote}
              </p>
            )}
          </section>

          {/* limitations — what breaks */}
          <section className="mt-14 max-w-[640px] border-t border-rule pt-[26px]">
            <SectionLabel>limitations · what breaks</SectionLabel>
            <div className="flex flex-col gap-3.5">
              {project.limitations.map((l) => (
                <p key={l.tag} className="text-body text-ink">
                  <span className="font-mono text-meta text-graphite">
                    {l.tag} —{" "}
                  </span>
                  {l.body}
                </p>
              ))}
            </div>
          </section>

          {/* links */}
          <section className="mt-14 flex gap-[26px] border-t border-rule pt-[26px] text-body">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-ink pb-0.5 text-ink"
              >
                live ↗
              </a>
            )}
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-ink pb-0.5 text-ink"
              >
                repo ↗
              </a>
            )}
            <Link href="/" className="border-b border-rule pb-0.5 text-graphite">
              all work ↗
            </Link>
          </section>

          <Footer />
        </main>
      </div>
    </div>
  );
}
