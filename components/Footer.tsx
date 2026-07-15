export default function Footer() {
  return (
    <footer id="contact" className="mt-24 border-t border-rule pt-6 pb-16">
      <div className="mb-6 font-mono text-micro text-graphite">contact</div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
        <span className="font-mono text-meta text-graphite">
          anshaditya sharma · chennai, in
        </span>
        <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-meta">
          <a href="mailto:anshadityasharma23@gmail.com" className="text-ink hover:text-signal">
            email ↗
          </a>
          <a
            href="https://github.com/AnshadityaSharma"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink hover:text-signal"
          >
            github ↗
          </a>
          <a
            href="https://www.linkedin.com/in/anshaditya-sharma"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink hover:text-signal"
          >
            linkedin ↗
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink hover:text-signal"
          >
            resume ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
