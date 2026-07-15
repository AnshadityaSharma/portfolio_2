import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { getProject, projects } from "@/data/projects";

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
    description: p.oneLiner,
    openGraph: { title: `${p.title} — Anshaditya Sharma`, description: p.oneLiner },
  };
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="mb-4 font-mono text-micro text-graphite">{children}</div>;
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
    <>
      <Nav />
      <main className="mx-auto max-w-[760px] px-6 py-16 sm:px-8">
        {/* header */}
        <div className="flex items-baseline gap-3 font-mono text-meta">
          <span className="text-graphite">{project.number}</span>
          <Link href="/#work" className="text-graphite hover:text-ink">
            ← all work
          </Link>
        </div>
        <h1 className="mt-6 font-display text-display font-medium text-ink">
          {project.title}
        </h1>
        <div className="mt-4 font-mono text-meta text-signal">
          {project.headlineMetric}
        </div>

        {/* the problem */}
        <p className="mt-8 max-w-[640px] text-lead text-ink">{project.problem}</p>

        {/* architecture — the one decision */}
        <section className="mt-16">
          <Label>architecture · the one decision</Label>
          <h2 className="text-body font-medium text-ink">
            {project.decision.heading}
          </h2>
          {project.decision.body.map((para, i) => (
            <p
              key={i}
              className={`mt-4 max-w-[640px] text-body ${
                i === 0 ? "text-ink" : "text-graphite"
              }`}
            >
              {para}
            </p>
          ))}
          <p className="mt-4 max-w-[640px] text-body text-graphite">
            <span className="font-mono text-meta text-graphite">rejected — </span>
            {project.decision.rejected}
          </p>
        </section>

        {/* metrics — labelled with how they were measured */}
        <section className="mt-14 border-t border-rule pt-6">
          <Label>metrics</Label>
          <div className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3">
            {project.metrics.map((m) => (
              <div key={m.label}>
                <div className="font-mono text-micro text-graphite">{m.label}</div>
                <div className="mt-1.5 font-mono text-lead font-medium text-ink">
                  {m.value}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-[640px] text-body text-graphite">
            <span className="font-mono text-meta text-graphite">
              how it was measured —{" "}
            </span>
            {project.metricsNote}
          </p>
        </section>

        {/* limitations */}
        <section className="mt-14 border-t border-rule pt-6">
          <Label>limitations · what breaks</Label>
          <div className="flex max-w-[640px] flex-col gap-3.5">
            {project.limitations.map((l) => (
              <p key={l.tag} className="text-body text-ink">
                <span className="font-mono text-meta text-graphite">{l.tag} — </span>
                {l.body}
              </p>
            ))}
          </div>
        </section>

        {/* links */}
        <section className="mt-14 flex gap-6 border-t border-rule pt-6 font-mono text-meta">
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-signal hover:text-ink"
            >
              live ↗
            </a>
          )}
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-signal hover:text-ink"
            >
              repo ↗
            </a>
          )}
          <Link href="/#work" className="text-graphite hover:text-ink">
            all work
          </Link>
        </section>

        <Footer />
      </main>
    </>
  );
}
