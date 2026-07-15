export default function Footer() {
  return (
    <footer className="mt-28 border-t border-rule pt-[22px] pb-14">
      <div className="flex flex-col gap-3 font-mono text-meta text-graphite sm:flex-row sm:items-baseline sm:justify-between">
        <span>anshaditya sharma · chennai, in</span>
        <div className="flex flex-wrap gap-[22px]">
          <a href="mailto:anshadityasharma23@gmail.com" className="text-ink">
            anshadityasharma23@gmail.com
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink"
          >
            resume ↗
          </a>
          <a
            href="https://github.com/AnshadityaSharma"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink"
          >
            github ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
