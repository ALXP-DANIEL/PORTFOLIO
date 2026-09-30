"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icons } from "@/components/icons";
import { useSplashGsap } from "@/hooks/use-splash-gsap";
import { cn } from "@/lib/utils";

type ProjectLiveProps = {
  slug: string;
  title: string;
  url: string;
};

const toolButton =
  "grid size-8 shrink-0 place-items-center rounded-full text-foreground/60 transition-colors hover:bg-foreground/8 hover:text-foreground";

/**
 * A live project in a near-full-screen window: 90% of the viewport on
 * desktop, edge-to-edge (minus a hairline gutter) on phones. The site's own
 * nav and footer step aside while it's open; the slim top bar carries back,
 * the project title, reload and new-tab.
 */
export default function ProjectLive({ slug, title, url }: ProjectLiveProps) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [pointerInside, setPointerInside] = useState(false);
  const host = new URL(url).host;
  const caseHref = `/work/${slug}`;

  // Hide the site's floating nav and footer so nothing overlaps the window.
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.immersive = "true";
    return () => {
      delete root.dataset.immersive;
    };
  }, []);

  // The page's reticle cursor can't follow the pointer into the iframe, so it
  // would freeze on the edge; hide it while the embedded site has the pointer.
  useEffect(() => {
    const root = document.documentElement;
    if (pointerInside) root.dataset.reticleHidden = "true";
    else delete root.dataset.reticleHidden;
    return () => {
      delete root.dataset.reticleHidden;
    };
  }, [pointerInside]);

  // Esc goes back to the case study (only fires while focus is on our page,
  // not inside the embedded site).
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") router.push(caseHref);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, caseHref]);

  // The window opens like a portal: a circle growing from its centre.
  useSplashGsap(
    (gsap) => {
      gsap.fromTo(
        "[data-live-window]",
        { clipPath: "circle(0% at 50% 50%)", autoAlpha: 1 },
        {
          clipPath: "circle(75% at 50% 50%)",
          duration: 0.9,
          ease: "power3.inOut",
          clearProps: "clipPath",
        },
      );
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef}>
      <div
        data-live-window
        className="invisible fixed inset-2 z-300 flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl sm:inset-x-[5vw] sm:inset-y-[5svh] sm:rounded-3xl"
      >
        <div className="relative flex h-11 shrink-0 items-center gap-1 border-b border-border px-2">
          <Link
            href={caseHref}
            data-reticle
            aria-label={`Back to ${title} case study`}
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-2.5 font-mono text-xs text-foreground/60 transition-colors hover:bg-foreground/8 hover:text-foreground"
          >
            <Icons.Generic.Back className="size-3.5" weight="bold" />
            <span className="hidden sm:inline">Back</span>
          </Link>

          <div className="flex min-w-0 flex-1 items-baseline justify-center gap-2 px-2 font-mono">
            <h1 className="truncate text-xs font-medium text-foreground">
              {title}
            </h1>
            <span className="hidden truncate text-[11px] text-foreground/40 sm:inline">
              {host}
            </span>
          </div>

          <button
            type="button"
            data-reticle
            onClick={() => {
              setLoading(true);
              setReloadKey((key) => key + 1);
            }}
            className={toolButton}
            aria-label="Reload"
          >
            <Icons.Portal.Reload className="size-4" weight="bold" />
          </button>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            data-reticle
            aria-label="Open in a new tab"
            className={toolButton}
          >
            <Icons.Layout.Footer.ArrowUpRight
              className="size-4"
              weight="bold"
            />
          </a>

          {/* load progress */}
          <span
            aria-hidden
            className={cn(
              "absolute inset-x-0 -bottom-px h-px origin-left bg-foreground/60 transition-[scale,opacity] duration-[1.8s] ease-out",
              loading ? "scale-x-75 opacity-100" : "scale-x-100 opacity-0",
            )}
          />
        </div>

        <div
          className="relative flex-1"
          onPointerEnter={() => setPointerInside(true)}
          onPointerLeave={() => setPointerInside(false)}
        >
          {loading ? (
            <p className="absolute inset-0 grid place-items-center font-mono text-xs text-foreground/45">
              <span>
                opening {host}
                <span className="animate-pulse">…</span>
              </span>
            </p>
          ) : null}
          <iframe
            key={reloadKey}
            src={url}
            title={`${title} live site`}
            onLoad={() => setLoading(false)}
            allow="fullscreen; clipboard-write; geolocation"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads"
            className={cn(
              "relative h-full w-full border-0 transition-opacity duration-500",
              loading ? "opacity-0" : "opacity-100",
            )}
          />
        </div>
      </div>
    </div>
  );
}
