/* One shape, used six times, no variants (build step 3).
   header row → viewport → 4px strip → mono metric line → title → desc → links.
   `demoAbove` exists for the design's cold-open: slot 01's demo IS the hero,
   so its block omits a second viewport rather than running two engines. */

import Link from "next/link";
import type { Project } from "@/data/projects";
import type { SlotStatus } from "@/lib/liveStore";
import FitnessStrip, { LiveFitnessStrip } from "./FitnessStrip";
import MetricLine from "./MetricLine";
import StatusBadge from "./StatusBadge";

export default function ProjectSlot({
  project,
  demo,
  demoAbove = false,
  initialStatus,
}: {
  project: Project;
  demo?: React.ReactNode;
  demoAbove?: boolean;
  initialStatus: SlotStatus;
}) {
  return (
    <section id={`p-${project.number}`} className="scroll-mt-10">
      {/* mono header row: 01 ──────── ● running */}
      <div className="flex items-center gap-[18px]">
        <span className="font-mono text-meta font-medium text-ink">
          {project.number}
        </span>
        <span className="h-px flex-1 bg-rule" />
        <StatusBadge slug={project.slug} initial={initialStatus} />
      </div>

      {/* demo viewport — full bleed on shelf, no frame, no rounding */}
      {!demoAbove && demo && (
        <div className="mt-[22px] bg-shelf">{demo}</div>
      )}

      {/* fitness strip — live if the demo publishes, static if measured,
          absent if the repo publishes no metric */}
      {project.demo === "engine" ? (
        <LiveFitnessStrip slug={project.slug} />
      ) : project.strip ? (
        <FitnessStrip data={project.strip} />
      ) : null}

      {/* mono metric line */}
      <MetricLine slug={project.slug} fallback={project.metricLine} />

      {/* title + two-line description */}
      <h2 className="mt-7 font-display text-title font-medium text-ink">
        {project.title}
      </h2>
      <p className="mt-3 max-w-[560px] text-body text-graphite">
        {project.description}
      </p>

      {/* text links — ink, never signal */}
      <div className="mt-5 flex gap-[26px] text-body">
        <Link
          href={`/work/${project.slug}`}
          className="border-b border-ink pb-0.5 text-ink"
        >
          detail ↗
        </Link>
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
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-rule pb-0.5 text-graphite"
          >
            live ↗
          </a>
        )}
      </div>
    </section>
  );
}
