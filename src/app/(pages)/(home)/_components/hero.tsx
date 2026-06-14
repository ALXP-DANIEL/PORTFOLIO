"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Icons } from "@/components/icons";

/* — Edit these to taste — */
const NAME = "Alif Daniel";
const ROLES = [
  "Frontend Engineer",
  "Creative Developer",
  "Interface Designer",
  "Web Tinkerer",
];
const INTRO =
  "I design and build fast, tactile web interfaces — from product UI and design systems to the occasional shader-soaked experiment.";
const SOCIALS = [
  { label: "GitHub", href: "https://github.com/ALXP-DANIEL", Icon: Icons.Social.GitHub },
  {
    label: "Email",
    href: "mailto:alifdaniel.personalspace@gmail.com",
    Icon: Icons.Layout.Footer.ArrowUpRight,
  },
];

const SCRAMBLE_CHARS = "!<>-_\\/[]{}=+*^?#01ﾊﾐﾋｰｳ";

/** Classic text-scramble: characters flicker through noise before settling. */
function scramble(el: HTMLElement, next: string): () => void {
  const old = el.dataset.text ?? el.textContent ?? "";
  el.dataset.text = next;
  const length = Math.max(old.length, next.length);
  const queue = Array.from({ length }, (_, i) => ({
    from: old[i] ?? "",
    to: next[i] ?? "",
    start: Math.floor(Math.random() * 22),
    end: Math.floor(Math.random() * 22) + 12,
    char: "",
  }));

  let frame = 0;
  let raf = 0;
  const tick = () => {
    let out = "";
    let done = 0;
    for (const q of queue) {
      if (frame >= q.start + q.end) {
        done++;
        out += q.to;
      } else if (frame >= q.start) {
        if (!q.char || Math.random() < 0.3) {
          q.char =
            SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
        out += `<span class="text-foreground/25">${q.char}</span>`;
      } else {
        out += q.from;
      }
    }
    el.innerHTML = out;
    if (done < queue.length) {
      frame++;
      raf = requestAnimationFrame(tick);
    }
  };
  tick();
  return () => cancelAnimationFrame(raf);
}

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);
  const magneticRef = useRef<HTMLAnchorElement>(null);

  // entrance timeline
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        "[data-rise]",
        { autoAlpha: 0, y: 14 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08 },
      )
        .fromTo(
          "[data-title]",
          { yPercent: 120 },
          { yPercent: 0, duration: 0.95 },
          "-=0.15",
        )
        .fromTo(
          "[data-fade]",
          { autoAlpha: 0, y: 16, filter: "blur(6px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.6,
            stagger: 0.08,
          },
          "-=0.5",
        );
    },
    { scope: rootRef },
  );

  // cycling scramble role
  useEffect(() => {
    const el = roleRef.current;
    if (!el) return;
    el.dataset.text = ROLES[0];
    let i = 0;
    let cancel: (() => void) | undefined;
    const id = window.setInterval(() => {
      i = (i + 1) % ROLES.length;
      cancel?.();
      cancel = scramble(el, ROLES[i]);
    }, 2900);
    return () => {
      window.clearInterval(id);
      cancel?.();
    };
  }, []);

  // magnetic primary CTA
  useGSAP(
    () => {
      const btn = magneticRef.current;
      if (!btn) return;
      const xTo = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3" });
      const yTo = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3" });
      const onMove = (e: PointerEvent) => {
        const r = btn.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.5);
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
      };
      btn.addEventListener("pointermove", onMove);
      btn.addEventListener("pointerleave", onLeave);
      return () => {
        btn.removeEventListener("pointermove", onMove);
        btn.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[calc(100dvh-8rem)] w-full flex-col justify-center gap-7 py-16"
    >
      {/* status + eyebrow */}
      <div className="flex flex-wrap items-center gap-3">
        <span
          data-rise
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/3 px-3 py-1 font-mono text-[11px] tracking-wide text-foreground/60"
        >
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
            <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
          </span>
          Available for work
        </span>
        <span
          data-rise
          className="font-mono text-[11px] tracking-[0.24em] text-foreground/35 uppercase"
        >
          Portfolio · {new Date().getFullYear()}
        </span>
      </div>

      {/* name */}
      <h1 className="text-6xl font-semibold tracking-tight text-foreground sm:text-8xl">
        <span className="block overflow-hidden pb-[0.12em]">
          <span data-title className="block">
            {NAME}
          </span>
        </span>
      </h1>

      {/* scramble role */}
      <p
        data-fade
        className="font-mono text-base text-foreground/70 sm:text-xl"
      >
        <span className="text-foreground/30">{"// "}</span>
        <span ref={roleRef} aria-live="off">
          {ROLES[0]}
        </span>
        <span className="ml-0.5 inline-block h-[1em] w-[0.5ch] translate-y-[0.12em] animate-pulse bg-foreground/60" />
      </p>

      {/* intro */}
      <p
        data-fade
        className="max-w-xl text-sm leading-7 text-foreground/55 sm:text-base"
      >
        {INTRO}
      </p>

      {/* CTAs */}
      <div data-fade className="flex flex-wrap items-center gap-3">
        <Link
          ref={magneticRef}
          href="/work"
          data-reticle
          className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
        >
          View work
          <Icons.Layout.Footer.ArrowUpRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            weight="bold"
          />
        </Link>
        <Link
          href="/contact"
          data-reticle
          className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-2.5 font-mono text-sm tracking-wide text-foreground/70 transition-colors hover:bg-white/6 hover:text-foreground"
        >
          Get in touch
        </Link>

        <div className="ml-1 flex items-center gap-1">
          {SOCIALS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              data-reticle
              aria-label={label}
              className="inline-flex size-10 items-center justify-center rounded-full text-foreground/45 transition-colors hover:bg-white/6 hover:text-foreground"
            >
              <Icon className="size-4" weight="bold" />
            </a>
          ))}
        </div>
      </div>

      {/* scroll cue */}
      <div
        data-fade
        className="absolute bottom-6 left-0 hidden items-center gap-3 sm:flex"
      >
        <span className="font-mono text-[10px] tracking-[0.24em] text-foreground/30 uppercase">
          Scroll
        </span>
        <span className="relative block h-8 w-px overflow-hidden bg-white/10">
          <span className="absolute inset-x-0 top-0 h-3 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-foreground/50" />
        </span>
      </div>
    </section>
  );
}
