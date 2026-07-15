import Link from "next/link";

/* Sticky top nav. Sentence case, mono labels. Blue used once, on the
   name, as a normal accent. Section links are anchors on the homepage. */

export default function Nav({ solid = false }: { solid?: boolean }) {
  return (
    <header
      className={`sticky top-0 z-20 border-b border-rule bg-paper/90 backdrop-blur ${
        solid ? "" : ""
      }`}
    >
      <div className="mx-auto flex max-w-[960px] items-center justify-between px-6 py-4 sm:px-8">
        <Link href="/" className="font-mono text-meta font-medium text-signal">
          ansh sharma
        </Link>
        <nav className="flex gap-5 font-mono text-meta text-graphite sm:gap-7">
          <Link href="/#work" className="hover:text-ink">
            work
          </Link>
          <Link href="/#about" className="hidden hover:text-ink sm:inline">
            about
          </Link>
          <Link href="/#skills" className="hidden hover:text-ink sm:inline">
            skills
          </Link>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink"
          >
            resume
          </a>
        </nav>
      </div>
    </header>
  );
}
