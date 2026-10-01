"use client";

import { useEffect, useRef, useState } from "react";
import { buildVCard, cardContact } from "@/components/business-card/card-data";
import LanyardCard from "@/components/business-card/lanyard-card";
import { Icons } from "@/components/icons";
import { useSplashGsap } from "@/hooks/use-splash-gsap";
import ContactGlobe from "./contact-globe";

const TIME_ZONE = "Asia/Kuala_Lumpur";

/** Live wall-clock in Malaysia, so visitors know when a reply is likely. */
function useLocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: TIME_ZONE,
    });
    const tick = () => setTime(format.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);

  return time;
}

export default function ContactBody() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const [copied, setCopied] = useState(false);
  const time = useLocalTime();
  const email = cardContact.email;

  useSplashGsap(
    (gsap) => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        "[data-entrance='contact-title']",
        { yPercent: 115 },
        { autoAlpha: 1, yPercent: 0, duration: 0.9, stagger: 0.08 },
      ).fromTo(
        "[data-entrance='contact-fade']",
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.06 },
        "-=0.5",
      );
    },
    { scope: rootRef },
  );

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — the mailto link still works */
    }
  };

  const saveContact = () => {
    const url = URL.createObjectURL(
      new Blob([buildVCard()], { type: "text/vcard" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "alxp-daniel.vcf";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      ref={rootRef}
      className="flex flex-col gap-20 overflow-x-clip sm:gap-28"
    >
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,540px)] lg:gap-12">
        <div className="flex flex-col gap-10 lg:pt-10">
          <div className="flex flex-col gap-5">
            <p
              data-entrance="contact-fade"
              className="flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-foreground/55 uppercase"
            >
              <span className="text-emerald-500">$</span> contact
              <span className="text-foreground/30">·</span>
              <span className="tracking-wide tabular-nums normal-case">
                Kuala Lumpur {time ?? "--:--"} GMT+8
              </span>
            </p>

            <h1 className="text-5xl leading-[0.95] font-semibold tracking-tight text-foreground sm:text-7xl">
              <span className="block overflow-hidden pb-[0.08em]">
                <span data-entrance="contact-title" className="block">
                  Say hello.
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.08em]">
                <span
                  data-entrance="contact-title"
                  className="block text-foreground/35"
                >
                  I read everything.
                </span>
              </span>
            </h1>

            <p
              data-entrance="contact-fade"
              className="max-w-md text-sm leading-7 text-foreground/55 sm:text-base"
            >
              Ideas, questions, a project you want a second pair of eyes on — or
              just to talk shop. Email is the fastest way to reach me; I usually
              reply within a day.
            </p>
          </div>

          {/* primary: email */}
          <div data-entrance="contact-fade" className="flex flex-col gap-3">
            <a
              href={`mailto:${email}`}
              data-reticle
              className="group inline-flex w-fit items-center gap-3 text-xl font-semibold tracking-tight break-all text-foreground sm:text-3xl"
            >
              {email}
              <Icons.Layout.Footer.ArrowUpRight
                className="size-5 shrink-0 text-foreground/40 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground"
                weight="bold"
              />
            </a>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                data-reticle
                onClick={copyEmail}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 font-mono text-xs tracking-wide text-foreground/65 transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                <Icons.Palette.Copy className="size-3.5" />
                {copied ? "Copied ✓" : "Copy email"}
              </button>
              <button
                type="button"
                data-reticle
                onClick={saveContact}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 font-mono text-xs tracking-wide text-background transition-colors hover:bg-foreground/90"
              >
                Save contact
              </button>
            </div>
          </div>
        </div>

        {/* the card, hanging from the top of the page */}
        <div className="-mt-25 flex flex-col items-center max-lg:order-first max-lg:-mb-16">
          <LanyardCard
            flipped={flipped}
            onFlip={() => setFlipped((value) => !value)}
          />
          <p className="-mt-24 font-mono text-[11px] tracking-wide text-foreground/40 max-lg:hidden">
            drag it, throw it, click to flip
          </p>
        </div>
      </div>

      <section
        aria-labelledby="elsewhere-heading"
        className="flex flex-col items-center gap-4"
      >
        <h2
          id="elsewhere-heading"
          className="font-mono text-[11px] tracking-[0.22em] text-foreground/60 uppercase"
        >
          Find me elsewhere
        </h2>
        <p className="text-center text-sm text-foreground/50">
          Hover a bubble for details · tap twice on touch to open
        </p>
        <ContactGlobe />
      </section>
    </div>
  );
}
