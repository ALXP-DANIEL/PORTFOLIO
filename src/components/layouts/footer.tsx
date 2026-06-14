"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import Link from "next/link";
import { useRef, useState } from "react";

import { Icons } from "@/components/icons";
import GlassSurface from "@/components/ui/glass-surface";
import { siteConfig } from "@/config/site";
import { socialsConfig } from "@/config/sosial";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [atBottom, setAtBottom] = useState(false);
  const year = new Date().getFullYear();
  const emailHref = `mailto:${siteConfig.links.email}`;

  useGSAP(
    () => {
      const trigger = ScrollTrigger.create({
        trigger: document.body,
        start: "bottom bottom+=80",
        end: "bottom bottom",
        onEnter: () => setAtBottom(true),
        onLeaveBack: () => setAtBottom(false),
      });

      return () => trigger.kill();
    },
    { scope: footerRef },
  );

  return (
    <motion.footer
      ref={footerRef}
      animate={{ bottom: atBottom ? 0 : 16 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="site-footer pointer-events-none fixed inset-x-0 z-200 px-4"
    >
      <div className="pointer-events-auto">
        <GlassSurface
          className={
            atBottom
              ? "mx-auto hidden rounded-t-[2rem] rounded-b-none p-1.5 lg:block"
              : "mx-auto hidden rounded-full p-1.5 lg:block"
          }
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
    </motion.footer>
  );
}
