import Link from "next/link";

import SectionWrapper from "@/components/wrapper/section";
import { cn } from "@/lib/utils";

type StatusPageAction = {
  href: string;
  label: string;
  variant?: "primary" | "secondary" | "ghost";
};

type StatusPageProps = {
  code: string;
  eyebrow: string;
  title: string;
  description: string;
  actions?: StatusPageAction[];
  className?: string;
};

const actionClassNames: Record<
  NonNullable<StatusPageAction["variant"]>,
  string
> = {
  primary:
    "border-primary bg-primary text-primary-foreground hover:bg-primary/85",
  secondary: "border-border/70 bg-background/80 text-foreground hover:bg-muted",
  ghost:
    "border-transparent bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
};

export default function StatusPage({
  code,
  eyebrow,
  title,
  description,
  actions = [],
  className,
}: StatusPageProps) {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <SectionWrapper
        className={cn(
          "mx-auto flex w-full max-w-5xl items-center border border-border/70 bg-background/70 p-6 shadow-[0_30px_120px_-72px_rgba(0,0,0,0.85)] sm:p-8 lg:p-10",
          className,
        )}
      >
        <div className="grid w-full gap-8 lg:items-center">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              <span className="size-2 rounded-full bg-primary" />
              {eyebrow}
            </div>

            <p className="mt-6 text-[4.5rem] leading-none font-semibold tracking-[-0.08em] text-primary sm:text-[5.5rem]">
              {code}
            </p>
            <h1 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              {description}
            </p>

            {actions.length > 0 ? (
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {actions.map(({ href, label, variant = "primary" }) => (
                  <Link
                    key={`${href}-${label}`}
                    href={href}
                    className={cn(
                      "inline-flex h-10 items-center justify-center rounded-lg border px-4 text-sm font-medium transition-colors",
                      actionClassNames[variant],
                    )}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
