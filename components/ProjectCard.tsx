"use client";

/* One project card: thumbnail well → number + title → one-liner →
   headline metric in mono → links. The thumbnail is a shelf-coloured
   well with the mono number; a real image at /thumbs/<slug>.png covers
   it when present, and hides itself cleanly if the file is missing, so
   there are never broken-image icons before the user adds art. */

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
        {/* placeholder always underneath */}
        <span className="pointer-events-none absolute left-4 top-3 font-mono text-meta text-graphite">
          {project.number}
        </span>
        <span className="pointer-events-none absolute bottom-3 right-4 font-mono text-micro text-graphite">
          thumbnail
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
