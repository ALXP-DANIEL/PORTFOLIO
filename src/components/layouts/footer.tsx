"use client";

import gsap from "gsap";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { Icons } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { socialsConfig } from "@/config/sosial";
import { usePageScrollState } from "@/hooks/use-page-scroll-state";
import { cn } from "@/lib/utils";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const { atBottom } = usePageScrollState();
  const year = new Date().getFullYear();
  const emailHref = `mailto:${siteConfig.links.email}`;
  const mounted = useRef(false);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    if (!mounted.current) {
      gsap.set(el, { bottom: atBottom ? 0 : 16 });
      mounted.current = true;
      return;
    }

    gsap.to(el, {
      bottom: atBottom ? 0 : 16,
      duration: 0.35,
      ease: "power1.out",
      overwrite: "auto",
    });
  }, [atBottom]);

  return (
    <footer
      ref={footerRef}
      className="site-footer pointer-events-none fixed inset-x-0 z-250 px-4"
    >
      <div className="pointer-events-auto">
        <div
          className={cn(
            "relative mx-auto hidden items-center justify-between gap-4 overflow-hidden rounded-full border border-border bg-background p-1.5 shadow-lg transition-[border-radius] duration-300 ease-out lg:flex",
            atBottom
              ? "rounded-t-[2rem] rounded-b-none"
              : "rounded-t-[2rem] rounded-b-[2rem]",
          )}
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
                  className="group inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
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
        </div>
      </div>
    </footer>
  );
}
