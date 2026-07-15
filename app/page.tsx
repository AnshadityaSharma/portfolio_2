import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import { projects } from "@/data/projects";

const skills: { group: string; items: string[] }[] = [
  { group: "languages", items: ["Java", "Python", "C++", "C", "JavaScript", "TypeScript", "Go", "SQL"] },
  { group: "frameworks", items: ["React", "Node", "Express", "FastAPI", "TensorFlow", "NLTK", "NumPy"] },
  { group: "systems", items: ["MongoDB", "Redis", "Docker", "GitHub Actions", "WebSockets", "REST APIs"] },
  { group: "embedded", items: ["ESP32", "Arduino", "Embedded C++", "Sensor integration"] },
];

const achievements: string[] = [
  "178 LeetCode problems solved (Java / C++)",
  "2-star CodeChef",
  "Multiple hackathon wins in real-time systems and hardware-software tracks",
  "Cultural Lead — UP Cultural Club",
  "Ran peer-learning sessions on DSA, Git and API design",
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
    <>
      <Nav />
      <main className="mx-auto max-w-[960px] px-6 sm:px-8">
        {/* 1 — hero */}
        <section className="pt-20 pb-24 md:pt-28 md:pb-28">
          <h1 className="max-w-[15ch] font-display text-display font-medium text-ink">
            I build systems that have to run in real time.
          </h1>
          <p className="mt-6 font-mono text-meta text-graphite">
            cs @ vit chennai &apos;27 · systems + real-time software
          </p>
          <p className="mt-5 max-w-[560px] text-lead text-graphite">
            Anshaditya Sharma — a matching engine measured in nanoseconds,
            evolution you can watch converge, and a rover that sees and drives.
            I&apos;m after SDE roles at product companies.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-meta">
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

        {/* 2 — about */}
        <Reveal>
          <section id="about" className="scroll-mt-20 border-t border-rule py-16">
            <Label>about</Label>
            <div className="max-w-[640px] space-y-4 text-body text-ink">
              <p>
                I&apos;m a B.Tech Computer Science student at VIT Chennai
                (2023–2027, CGPA 8.15/10). I build systems where timing is the
                hard part — engines measured in microseconds, real-time
                collaborative state, vision loops closing on hardware.
              </p>
              <p className="text-graphite">
                The through-line across everything here: each project runs, and
                each one measures itself. Where a project has a real benchmark I
                show it and say how it was taken; where it doesn&apos;t, I say
                that too. I&apos;m looking for SDE roles at product companies.
              </p>
            </div>
          </section>
        </Reveal>

        {/* 3 — skills */}
        <Reveal>
          <section id="skills" className="scroll-mt-20 border-t border-rule py-16">
            <Label>skills</Label>
            <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {skills.map((s) => (
                <div key={s.group}>
                  <div className="font-mono text-meta text-signal">{s.group}</div>
                  <div className="mt-2 text-body text-ink">
                    {s.items.join(" · ")}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* 4 — projects */}
        <Reveal>
          <section id="work" className="scroll-mt-20 border-t border-rule py-16">
            <Label>work · six projects</Label>
            <div className="grid gap-5 sm:grid-cols-2">
              {projects.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </section>
        </Reveal>

        {/* 5 — achievements */}
        <Reveal>
          <section id="achievements" className="scroll-mt-20 border-t border-rule py-16">
            <Label>achievements</Label>
            <ul className="max-w-[640px] space-y-3">
              {achievements.map((a) => (
                <li key={a} className="flex gap-3 text-body text-ink">
                  <span className="mt-1 font-mono text-micro text-signal">—</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        {/* 6 — contact */}
        <Reveal>
          <Footer />
        </Reveal>
      </main>
    </>
  );
}
