"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { Icons } from "@/components/icons";
import BlurImage from "@/components/ui/blur-image";
import { siteConfig } from "@/config/site";
import { useMagnetic } from "@/hooks/use-magnetic";
import { useSplashGsap } from "@/hooks/use-splash-gsap";
import { useScrambleText } from "../_hooks/use-scramble-text";

const HERO_IMAGE = "/hero-desktop.png";
const HERO_MOBILE_IMAGE = "/hero-mobile.png";
const RESUME_URL = "/RESUME.pdf";

const ROLES = [
  "Full-Stack Web Developer",
  "Frontend Engineer",
  "Backend Developer",
  "Problem Solver",
];

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const desktopBackgroundRef = useRef<HTMLDivElement>(null);
  const mobileBackgroundRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);
  const magneticRef = useRef<HTMLAnchorElement>(null);

  useSplashGsap(
    (gsap) => {
      const rise = gsap.utils.toArray("[data-entrance='hero-rise']");
      const title = gsap.utils.toArray("[data-entrance='hero-title']");
      const fade = gsap.utils.toArray("[data-entrance='hero-fade']");
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (rise.length > 0) {
        tl.fromTo(
          rise,
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08 },
        );
      }

      if (title.length > 0) {
        tl.fromTo(
          title,
          { yPercent: 120 },
          { autoAlpha: 1, yPercent: 0, duration: 0.95 },
          rise.length > 0 ? "-=0.15" : 0,
        );
      }

      if (fade.length > 0) {
        tl.fromTo(
          fade,
          { autoAlpha: 0, y: 16, filter: "blur(6px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.6,
            stagger: 0.08,
          },
          title.length > 0 ? "-=0.5" : 0,
        );
      }
    },
    { scope: rootRef },
  );

  useGSAP(
    () => {
      const root = rootRef.current;
      const desktopBackground = desktopBackgroundRef.current;
      const mobileBackground = mobileBackgroundRef.current;

      if (!root) return;
      if (!window.matchMedia("(pointer: fine)").matches) return;

      const backgrounds = [desktopBackground, mobileBackground].filter(
        Boolean,
      ) as HTMLDivElement[];

      const controls = backgrounds.map((background) => {
        const image = background.querySelector<HTMLElement>(
          "[data-hero-bg-image]",
        );

        return {
          background,
          image,
          rx: gsap.quickTo(background, "rotationX", {
            duration: 0.7,
            ease: "power3",
          }),
          ry: gsap.quickTo(background, "rotationY", {
            duration: 0.7,
            ease: "power3",
          }),
          ix: image
            ? gsap.quickTo(image, "xPercent", {
                duration: 0.9,
                ease: "power3",
              })
            : null,
          iy: image
            ? gsap.quickTo(image, "yPercent", {
                duration: 0.9,
                ease: "power3",
              })
            : null,
        };
      });

      const onMove = (event: PointerEvent) => {
        const rect = root.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / rect.width - 0.5;
        const ny = (event.clientY - rect.top) / rect.height - 0.5;

        for (const control of controls) {
          control.rx(-ny * 3.5);
          control.ry(nx * 3.5);
          control.ix?.(nx * -2.5);
          control.iy?.(ny * -2.5);
        }
      };

      const onLeave = () => {
        for (const control of controls) {
          control.rx(0);
          control.ry(0);
          control.ix?.(0);
          control.iy?.(0);
        }
      };

      root.addEventListener("pointermove", onMove);
      root.addEventListener("pointerleave", onLeave);

      return () => {
        root.removeEventListener("pointermove", onMove);
        root.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: rootRef },
  );

  useScrambleText(roleRef, ROLES);
  useMagnetic(magneticRef);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[calc(100svh-8rem)] w-full flex-col justify-end overflow-hidden py-12 md:justify-center md:overflow-visible md:py-16"
      style={{ perspective: "1400px" }}
    >
      {/* Desktop background */}
      <div
        ref={desktopBackgroundRef}
        className="pointer-events-none absolute -inset-y-16 left-1/2 -z-10 hidden w-screen -translate-x-1/2 overflow-hidden will-change-transform transform-3d md:block"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 16%, black 82%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 16%, black 82%, transparent 100%)",
        }}
      >
        <div
          data-hero-bg-image
          className="absolute -inset-8 will-change-transform"
        >
          <BlurImage
            src={HERO_IMAGE}
            alt={siteConfig.name}
            fill
            sizes="(min-width: 768px) 100vw, 0px"
            wrapperClassName="absolute inset-0 h-full w-full"
            className="h-full w-full object-cover object-right"
          />
        </div>

        <div className="absolute inset-0 bg-linear-to-r from-black from-10% via-black/80 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-36 bg-linear-to-b from-background/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-linear-to-t from-background/90 to-transparent" />
      </div>

      {/* Mobile background */}
      <div
        ref={mobileBackgroundRef}
        className="pointer-events-none absolute inset-0 -z-10 block overflow-hidden will-change-transform transform-3d md:hidden"
        style={{
          maskImage: `
      linear-gradient(to bottom, transparent 0%, black 14%, black 78%, transparent 100%),
      linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)
    `,
          WebkitMaskImage: `
      linear-gradient(to bottom, transparent 0%, black 14%, black 78%, transparent 100%),
      linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)
    `,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      >
        <div
          data-hero-bg-image
          className="absolute -inset-6 will-change-transform"
        >
          <BlurImage
            src={HERO_MOBILE_IMAGE}
            alt={siteConfig.name}
            fill
            sizes="(min-width: 768px) 0px, 100vw"
            wrapperClassName="absolute inset-0 h-full w-full"
            className="h-full w-full object-cover object-top"
            eager
          />
        </div>

        <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-background/65 via-background/20 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 h-[70%] bg-linear-to-t from-background from-18% via-background/90 via-52% to-transparent" />

        <div className="absolute inset-0 bg-black/15" />
      </div>
      {/* Content */}
      <div className="relative z-10 flex max-w-xl flex-col gap-6 pb-6 md:pb-0">
        <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          <span className="block overflow-hidden pb-[0.12em]">
            <span data-entrance="hero-title" className="block">
              {siteConfig.author}
            </span>
          </span>
        </h1>

        <p
          data-entrance="hero-fade"
          className="font-mono text-base text-foreground/70 sm:text-xl"
        >
          <span className="text-foreground/30">{"// "}</span>
          <span ref={roleRef} aria-live="off">
            {ROLES[0]}
          </span>
          <span className="ml-0.5 inline-block h-[1em] w-[0.5ch] translate-y-[0.12em] animate-pulse bg-foreground/60" />
        </p>

        <p
          data-entrance="hero-fade"
          className="max-w-xl text-sm leading-7 text-foreground/55 sm:text-base"
        >
          {siteConfig.description}
        </p>

        <div
          data-entrance="hero-fade"
          className="flex flex-wrap items-center gap-3"
        >
          <a
            ref={magneticRef}
            href={RESUME_URL}
            target="_blank"
            rel="noreferrer"
            data-reticle
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Resume
            <Icons.Layout.Footer.ArrowUpRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              weight="bold"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
