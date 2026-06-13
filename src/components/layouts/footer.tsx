"use client";

import Link from "next/link";

import { Icons } from "@/components/icons";
import GlassSurface from "@/components/ui/glass-surface";
import { siteConfig } from "@/config/site";
import { socialsConfig } from "@/config/sosial";

export default function Footer() {
  const year = new Date().getFullYear();
  const emailHref = `mailto:${siteConfig.links.email}`;

  return (
    <footer className="site-footer pointer-events-none fixed inset-x-0 bottom-4 z-200 px-4">
      <div className="pointer-events-auto">
        <GlassSurface
          className="mx-auto hidden p-1.5 lg:block"
          contentClassName="flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="px-3 font-mono tracking-wide">
              © {year} {siteConfig.name}
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-border sm:inline-block" />
            <span className="hidden px-3 font-mono tracking-wide sm:inline-block">
              {siteConfig.author}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {socialsConfig.map(({ icon, link, platform }) => {
              const Icon = Icons.Social[icon];

              return (
                <Link
                  key={platform}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={platform}
                  className="group inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/8 hover:text-foreground"
                >
                  <Icon
                    className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    weight="bold"
                  />
                </Link>
              );
            })}

            <Link
              href={emailHref}
              className="ml-1 inline-flex items-center gap-2 rounded-full border border-border/60 bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Say hello
              <Icons.Layout.Footer.ArrowUpRight
                className="size-3.5"
                weight="bold"
              />
            </Link>
          </div>
        </GlassSurface>
      </div>
    </footer>
  );
}
