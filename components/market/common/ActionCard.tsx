"use client";

interface ActionCardProps {
  title: string;
  label: string;
  targetId: string;
}

export function ActionCard({ title, label, targetId }: ActionCardProps) {
  function scrollToSection() {
    document.getElementById(targetId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <button
      type="button"
      onClick={scrollToSection}
      className="group flex min-h-12 min-w-0 flex-col items-center justify-center rounded-xl border border-border/70 bg-background/80 px-0.5 py-1.5 text-center text-[9px] font-semibold leading-tight text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:translate-y-0 sm:min-h-14 sm:px-1 sm:text-xs"
      aria-label={`Go to ${title}`}
    >
      <span
        aria-hidden="true"
        className="mb-1 h-1 w-4 shrink-0 rounded-full bg-primary/45 transition-all group-hover:w-6 group-hover:bg-primary sm:mb-1.5"
      />
      <span className="line-clamp-2">{label}</span>
    </button>
  );
}
