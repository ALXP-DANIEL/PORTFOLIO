import Link from "next/link";

import SectionWrapper from "@/components/wrapper/section";

export default function HomePage() {
  return (
    <section className="pt-8 sm:pt-12">
      <SectionWrapper className="space-y-6 py-10 sm:py-14">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Home
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Clean, typed UI for real product work.
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            This page now serves as a simple starting point for the application.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            View Projects
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Read Blog
          </Link>
        </div>
      </SectionWrapper>
    </section>
  );
}
