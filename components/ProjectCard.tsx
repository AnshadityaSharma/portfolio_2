"use client";

/* One project block: thumbnail → number + title → one-liner → headline
   metric in mono → links. The thumbnail is a shelf-coloured well; a real
   image at /thumbs/<slug>.png covers it when present and hides itself
   cleanly if missing, so there are never broken-image icons before the
   real art is added. */

import { useState } from "react";
import Link from "next/link";
import type { Project } from "@/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  const [imgOk, setImgOk] = useState(true);

  return (
    <article className="group flex flex-col border border-rule bg-paper">
      <Link
        href={`/work/${project.slug}`}
        className="relative block aspect-[16/10] w-full overflow-hidden bg-shelf"
        aria-label={`${project.title} — detail`}
      >
        {/* placeholder underneath: big faint number + tiny caption */}
        <span
          className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono font-medium text-rule"
          style={{ fontSize: "clamp(56px, 12vw, 92px)" }}
          aria-hidden="true"
        >
          {project.number}
        </span>
        <span className="pointer-events-none absolute bottom-3 left-4 font-mono text-micro text-graphite">
          {project.slug}.png
        </span>
        {imgOk && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.thumb}
            alt={project.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            onError={() => setImgOk(false)}
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-meta text-graphite">
            {project.number}
          </span>
          <h3 className="font-display text-lead font-medium text-ink">
            <Link href={`/work/${project.slug}`} className="hover:text-signal">
              {project.title}
            </Link>
          </h3>
        </div>

        <p className="mt-2 text-body text-graphite">{project.oneLiner}</p>

        <div className="mt-3 font-mono text-meta text-ink">
          {project.headlineMetric}
        </div>

        <div className="mt-5 flex gap-4 border-t border-rule pt-4 font-mono text-meta">
          <Link href={`/work/${project.slug}`} className="text-signal hover:text-ink">
            detail
          </Link>
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-graphite hover:text-ink"
            >
              repo ↗
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-graphite hover:text-ink"
            >
              live ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
