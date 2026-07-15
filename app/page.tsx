import ProjectCard from "@/components/ProjectCard";
import Rail from "@/components/Rail";
import Reveal from "@/components/Reveal";
import { projects } from "@/data/projects";

/* Four headline numbers — the main visual anchor. All measured:
   178 LeetCode (memory), 2.10M ops/sec (bench/results.md),
   ~21m crawl (evocreatures README), 8.15 CGPA (user). */
const stats: { value: string; label: string }[] = [
  { value: "178", label: "dsa problems solved, java + c++" },
  { value: "2.10M", label: "ops/sec, exchange matching engine (benchmark harness)" },
  { value: "21m", label: "evolved crawl distance, evocreatures deterministic run" },
  { value: "8.15", label: "cgpa, b.tech cse @ vit chennai" },
];

const capabilities: { group: string; items: string[] }[] = [
  {
    group: "performance systems",
    items: [
      "deterministic order matching",
      "websocket deltas",
      "write-behind persistence",
      "benchmark-driven design",
    ],
  },
  {
    group: "applied intelligence",
    items: [
      "nlp search pipelines",
      "vlm-controlled robotics",
      "genetic algorithms",
    ],
  },
  {
    group: "interactive systems",
    items: [
      "three.js replay viewers",
      "collaborative canvases",
      "chrome extensions",
    ],
  },
];

/* Grouped stack. The user's message cut off at "Data & infra —
   MongoDB, Postgres, Firebase, Redis," — the rest is completed from
   the actual tech across the six repos; correct as needed. */
const stack: { group: string; items: string[] }[] = [
  { group: "languages", items: ["Java", "Python", "C++", "C", "JavaScript", "TypeScript", "Go", "SQL"] },
  { group: "backend", items: ["Node.js", "Express", "FastAPI", "REST", "WebSockets", "JWT", "Swagger / OpenAPI"] },
  { group: "data & infra", items: ["MongoDB", "Postgres", "Firebase", "Redis", "Docker", "GitHub Actions", "Vercel", "Railway"] },
  { group: "applied ai", items: ["TensorFlow", "NLTK", "MediaPipe", "Gemini Vision", "NumPy", "WordNet"] },
  { group: "embedded", items: ["ESP32", "ESP32-CAM", "Arduino", "Embedded C++", "sensor integration"] },
  { group: "frontend", items: ["React", "Three.js", "Vite", "Chrome extensions (MV3)"] },
];

const trajectory: { key: string; head: string; detail: string }[] = [
  {
    key: "2023–2027",
    head: "B.Tech CSE, VIT Chennai",
    detail: "DSA, DBMS, OS, networks, ML, architecture, applied cryptography",
  },
  {
    key: "final year",
    head: "Semi-autonomous VLM rover",
    detail:
      "ESP32-CAM + Gemini Vision, live frame interpretation and obstacle avoidance",
  },
  {
    key: "leadership",
    head: "Hackathon wins in real-time systems and hardware-software tracks",
    detail: "Cultural Lead, UP Cultural Club",
  },
  {
    key: "practice",
    head: "178 LeetCode problems, 2-star CodeChef",
    detail: "peer sessions on DSA, Git workflows, API design",
  },
];

const contactLinks: { label: string; href: string; external?: boolean }[] = [
  { label: "github ↗", href: "https://github.com/AnshadityaSharma", external: true },
  { label: "leetcode ↗", href: "https://leetcode.com/u/Anshaditya_sharma", external: true },
  { label: "resume ↗", href: "/resume.pdf", external: true },
];

const heroLinks: { label: string; href: string; external?: boolean }[] = [
  { label: "github ↗", href: "https://github.com/AnshadityaSharma", external: true },
  { label: "leetcode ↗", href: "https://leetcode.com/u/Anshaditya_sharma/", external: true },
  { label: "email ↗", href: "mailto:anshadityasharma23@gmail.com" },
  { label: "resume ↗", href: "/resume.pdf", external: true },
];

function Label({ children }: { children: React.ReactNode }) {
  return <div className="mb-6 font-mono text-micro text-graphite">{children}</div>;
}

export default function Home() {
  return (
    <div className="mx-auto flex max-w-[1120px] flex-col gap-10 px-6 py-8 sm:px-8 md:flex-row md:gap-12 md:py-14">
      <Rail />

      <main className="min-w-0 flex-1">
        {/* hero */}
        <section className="pb-4">
          <h1 className="max-w-[16ch] font-display text-display font-medium text-ink">
            I build systems that have to run in real time.
          </h1>
          <p className="mt-6 font-mono text-meta text-graphite">
            anshaditya sharma · cs @ vit chennai &apos;27
          </p>
          <p className="mt-5 max-w-[560px] text-lead text-graphite">
            Backend systems, applied AI, and embedded — a matching engine
            measured in nanoseconds, evolution you can watch converge, and a
            rover that sees and drives. I&apos;m after SDE roles at product
            companies.
          </p>
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 font-mono text-meta">
            {heroLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noopener noreferrer" : undefined}
                className="text-signal hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </div>
        </section>

        {/* stat block — the anchor */}
        <section className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 border-y border-rule py-12 md:grid-cols-4 md:gap-x-6">
          {stats.map((s) => (
            <div key={s.label}>
              <div
                className="font-mono font-medium leading-none text-ink"
                style={{ fontSize: "clamp(44px, 7vw, 76px)" }}
              >
                {s.value}
              </div>
              <div className="mt-3 max-w-[22ch] font-mono text-micro text-graphite">
                {s.label}
              </div>
            </div>
          ))}
        </section>

        {/* about */}
        <Reveal>
          <section id="about" className="scroll-mt-14 py-16">
            <Label>about</Label>
            <div className="max-w-[640px] space-y-4 text-body text-ink">
              <p>
                I&apos;m Anshaditya — a B.Tech Computer Science &amp; Engineering
                student at VIT Chennai (2023–2027). I build backend systems,
                applied-AI pipelines, and embedded software, and I care most
                about the parts where timing and correctness are the hard
                constraints.
              </p>
              <p className="text-graphite">
                Across everything here the through-line is the same: each
                project runs, and each one measures itself. Where there&apos;s a
                real benchmark I show it and say how it was taken; where there
                isn&apos;t, I say that too. I&apos;m looking for SDE roles at
                product companies.
              </p>
            </div>
          </section>
        </Reveal>

        {/* what i build */}
        <Reveal>
          <section id="build" className="scroll-mt-14 border-t border-rule py-16">
            <Label>what i build</Label>
            <div className="grid gap-x-10 gap-y-10 sm:grid-cols-3">
              {capabilities.map((c) => (
                <div key={c.group}>
                  <div className="font-mono text-meta text-signal">{c.group}</div>
                  <ul className="mt-3 space-y-1.5 text-body text-ink">
                    {c.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* projects */}
        <Reveal>
          <section id="work" className="scroll-mt-14 border-t border-rule py-16">
            <Label>work · six projects</Label>
            <div className="grid gap-5 sm:grid-cols-2">
              {projects.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </section>
        </Reveal>

        {/* technical stack */}
        <Reveal>
          <section id="stack" className="scroll-mt-14 border-t border-rule py-16">
            <Label>technical stack</Label>
            <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {stack.map((s) => (
                <div key={s.group}>
                  <div className="font-mono text-meta text-signal">{s.group}</div>
                  <div className="mt-2 text-body text-ink">{s.items.join(" · ")}</div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* trajectory */}
        <Reveal>
          <section id="trajectory" className="scroll-mt-14 border-t border-rule py-16">
            <Label>trajectory</Label>
            <div className="flex flex-col border-y border-rule">
              {trajectory.map((t) => (
                <div
                  key={t.key}
                  className="grid gap-x-8 gap-y-1 border-b border-rule py-5 last:border-b-0 sm:grid-cols-[130px_1fr]"
                >
                  <div className="font-mono text-meta text-graphite">{t.key}</div>
                  <div className="text-body text-ink">
                    {t.head}
                    <span className="text-graphite"> — {t.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* contact — a real section */}
        <Reveal>
          <section id="contact" className="scroll-mt-14 border-t border-rule py-16">
            <Label>contact</Label>
            <p className="max-w-[560px] text-lead text-graphite">
              Open to SDE roles and internships at product companies. The
              fastest way to reach me is email.
            </p>
            <a
              href="mailto:anshadityasharma23@gmail.com"
              className="mt-6 inline-block break-all font-display text-lead font-medium text-ink hover:text-signal sm:text-title"
            >
              anshadityasharma23@gmail.com
            </a>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-meta">
              {contactLinks.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target={l.external ? "_blank" : undefined}
                  rel={l.external ? "noopener noreferrer" : undefined}
                  className="text-signal hover:text-ink"
                >
                  {l.label}
                </a>
              ))}
            </div>
            <div className="mt-16 font-mono text-micro text-graphite">
              anshaditya sharma · chennai, in
            </div>
          </section>
        </Reveal>
      </main>
    </div>
  );
}
