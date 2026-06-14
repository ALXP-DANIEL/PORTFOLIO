"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState } from "react";
import { Icons } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { socialsConfig } from "@/config/sosial";

gsap.registerPlugin(ScrollTrigger);

const FACTS = [
  { label: "Status", value: "Available for work" },
  { label: "Based in", value: "Malaysia · Remote" },
  { label: "Response", value: "Within a day" },
];

export default function ContactBody() {
  const ref = useRef<HTMLDivElement>(null);
  const email = siteConfig.links.email;
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — the mailto link still works */
    }
  };

  useGSAP(
    () => {
      const blocks = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      ScrollTrigger.batch(blocks, {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { autoAlpha: 0, y: 24 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
              stagger: 0.1,
            },
          ),
      });
      return () => {
        for (const t of ScrollTrigger.getAll()) t.kill();
      };
    },
    { scope: ref },
  );

  const channels = socialsConfig.filter((social) => social.link);

  return (
    <div ref={ref} className="flex flex-col gap-12 sm:gap-16">
      {/* statement */}
      <div data-reveal className="flex flex-col gap-4">
        <p className="font-mono text-[11px] tracking-[0.22em] text-foreground/40 uppercase">
          Get in touch
        </p>
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Have a project, a role, or just an idea? Let&apos;s talk.
        </h2>
      </div>

      {/* email — the main CTA */}
      <div
        data-reveal
        className="flex flex-col gap-4 border-t border-white/10 pt-10"
      >
        <p className="font-mono text-[11px] tracking-[0.18em] text-foreground/35 uppercase">
          Email
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <a
            href={`mailto:${email}`}
            data-reticle
            className="text-2xl font-semibold tracking-tight text-foreground transition-colors hover:text-foreground/70 sm:text-4xl"
          >
            {email}
          </a>
          <button
            type="button"
            data-reticle
            onClick={copyEmail}
            className="inline-flex items-center gap-2 rounded-full border border-white/12 px-3.5 py-1.5 font-mono text-[11px] tracking-wide text-foreground/60 transition-colors hover:bg-white/6 hover:text-foreground"
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
      </div>

      {/* facts */}
      <dl
        data-reveal
        className="grid gap-px overflow-hidden border border-white/10 bg-white/5 sm:grid-cols-3"
      >
        {FACTS.map((fact) => (
          <div key={fact.label} className="bg-background/60 p-5">
            <dt className="font-mono text-[10px] tracking-[0.18em] text-foreground/40 uppercase">
              {fact.label}
            </dt>
            <dd className="mt-2 flex items-center gap-2 text-base font-medium tracking-tight text-foreground">
              {fact.label === "Status" ? (
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
                </span>
              ) : null}
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>

      {/* channels */}
      <div
        data-reveal
        className="flex flex-col gap-5 border-t border-white/10 pt-10"
      >
        <p className="font-mono text-[11px] tracking-[0.18em] text-foreground/35 uppercase">
          Elsewhere
        </p>
        <div className="flex flex-wrap gap-3">
          {channels.map((channel) => {
            const Icon = Icons.Social[channel.icon];
            return (
              <a
                key={channel.platform}
                href={channel.link}
                target="_blank"
                rel="noreferrer"
                data-reticle
                className="group inline-flex items-center gap-2.5 rounded-full border border-white/10 px-4 py-2 font-mono text-sm tracking-wide text-foreground/65 transition-colors hover:bg-white/6 hover:text-foreground"
              >
                <Icon className="size-4" weight="bold" />
                {channel.platform}
                <Icons.Layout.Footer.ArrowUpRight
                  className="size-3.5 text-foreground/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground/70"
                  weight="bold"
                />
              </a>
            );
          })}
          {siteConfig.url.author ? (
            <a
              href={siteConfig.url.author}
              target="_blank"
              rel="noreferrer"
              data-reticle
              className="group inline-flex items-center gap-2.5 rounded-full border border-white/10 px-4 py-2 font-mono text-sm tracking-wide text-foreground/65 transition-colors hover:bg-white/6 hover:text-foreground"
            >
              <Icons.Layout.Navigation.Home className="size-4" weight="bold" />
              Portfolio
              <Icons.Layout.Footer.ArrowUpRight
                className="size-3.5 text-foreground/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground/70"
                weight="bold"
              />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
