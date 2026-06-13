import Link from "next/link";
import type { PortfolioPage } from "@/lib/pages";

type PageSectionProps = {
  page: PortfolioPage;
  showLink?: boolean;
};

export default function PageSection({
  page,
  showLink = false,
}: PageSectionProps) {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-5 py-14">
      <div className="flex flex-col gap-3">
        <p className="font-mono text-xs tracking-[0.22em] text-foreground/40 uppercase">
          {page.label}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {page.title}
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-foreground/58 sm:text-base">
          {page.description}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <p className="font-mono text-[11px] tracking-wide text-foreground/35">
            01
          </p>
          <p className="mt-3 text-sm leading-6 text-foreground/62">
            Placeholder detail for this page section.
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <p className="font-mono text-[11px] tracking-wide text-foreground/35">
            02
          </p>
          <p className="mt-3 text-sm leading-6 text-foreground/62">
            Placeholder supporting information for later content.
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <p className="font-mono text-[11px] tracking-wide text-foreground/35">
            03
          </p>
          <p className="mt-3 text-sm leading-6 text-foreground/62">
            Placeholder note for layout and visual rhythm.
          </p>
        </div>
      </div>

      {showLink ? (
        <Link
          href={page.href}
          className="w-fit rounded-full border border-white/10 px-4 py-2 font-mono text-xs tracking-wide text-foreground/60 transition-colors hover:bg-white/8 hover:text-foreground"
        >
          Open {page.label}
        </Link>
      ) : null}
    </section>
  );
}
