"use client";

import { useEffect, useRef, useState } from "react";
import { Icons } from "@/components/icons";
import { NavigationActionSlot } from "@/components/layouts/navigation-action";
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
 * A live project running inside the portfolio's own shell: the site keeps its
 * nav and footer, and the project loads in a browser-window frame below.
 */
export default function ProjectLive({ slug, title, url }: ProjectLiveProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [pointerInside, setPointerInside] = useState(false);
  const host = new URL(url).host;

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
    <div
      ref={rootRef}
      className="relative left-1/2 w-[min(calc(100vw-2.5rem),1600px)] -translate-x-1/2"
    >
      <NavigationActionSlot
        spec={{
          kind: "link",
          href: `/work/${slug}`,
          label: "← Case study",
          icon: Icons.Generic.Back,
        }}
      />

      <div
        data-live-window
        className="invisible flex h-[calc(100svh-13rem)] min-h-[420px] flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl lg:h-[calc(100svh-15rem)]"
      >
        <div className="relative flex h-13 shrink-0 items-center gap-2 border-b border-border px-3">
          <span className="hidden truncate px-2 font-mono text-xs text-foreground/60 sm:block sm:max-w-40">
            {title}
          </span>
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              setReloadKey((key) => key + 1);
            }}
            className={toolButton}
            aria-label="Reload"
          >
            <Icons.Portal.Reload className="size-4" weight="bold" />
          </button>

          <div className="mx-auto flex min-w-0 max-w-md flex-1 items-center justify-center gap-2 rounded-full bg-foreground/5 px-4 py-1.5 font-mono text-xs text-foreground/60">
            <Icons.Portal.Secure className="size-3.5 shrink-0" weight="bold" />
            <span className="truncate">{host}</span>
          </div>

          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            data-reticle
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 font-mono text-xs text-foreground/60 transition-colors hover:bg-foreground/8 hover:text-foreground"
          >
            <span className="hidden sm:inline">New tab</span>
            <Icons.Layout.Footer.ArrowUpRight
              className="size-3.5"
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
