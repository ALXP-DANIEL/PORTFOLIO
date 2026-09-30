"use client";

import { Dialog } from "@base-ui/react/dialog";
import type { Icon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
import { Icons } from "@/components/icons";
import { routeConfig } from "@/config/route";
import { siteConfig } from "@/config/site";
import { socialsConfig } from "@/config/sosial";
import { useOverlayCursor } from "@/hooks/use-overlay-cursor";
import { cn } from "@/lib/utils";
import { OPEN_COMMAND_PALETTE_EVENT } from "./events";

export type PaletteProject = {
  slug: string;
  title: string;
  category: string;
  year: string;
};

type Command = {
  id: string;
  group: "Navigate" | "Projects" | "Actions" | "Elsewhere";
  label: string;
  hint?: string;
  keywords?: string;
  icon: Icon;
  /** Return a short status line to flash in the prompt instead of closing. */
  run: () => string | undefined;
};

const RESUME_URL = "/RESUME.pdf";
const GROUP_ORDER: Command["group"][] = [
  "Navigate",
  "Projects",
  "Actions",
  "Elsewhere",
];

/**
 * Subsequence fuzzy score — every query char must appear in order. Consecutive
 * runs and word-start hits score higher, so "wg" ranks WasteGrab first.
 */
function score(query: string, text: string): number {
  if (!query) return 1;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let total = 0;
  let run = 0;
  let ti = 0;
  for (const ch of q) {
    const found = t.indexOf(ch, ti);
    if (found === -1) return 0;
    run = found === ti ? run + 1 : 1;
    const wordStart = found === 0 || /[\s\-/·]/.test(t[found - 1]);
    total += run * 2 + (wordStart ? 3 : 0);
    ti = found + 1;
  }
  return total;
}

function isTypingTarget(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return (
    !!el &&
    (el.tagName === "INPUT" ||
      el.tagName === "TEXTAREA" ||
      el.isContentEditable)
  );
}

export default function CommandPalette({
  projects,
}: {
  projects: PaletteProject[];
}) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [flash, setFlash] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useOverlayCursor(open);

  // ⌘K / Ctrl+K anywhere, "/" when not typing, plus a custom event for buttons.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const combo =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      const slash =
        event.key === "/" &&
        !event.metaKey &&
        !event.ctrlKey &&
        !isTypingTarget(event.target);
      if (!combo && !slash) return;
      event.preventDefault();
      setOpen((value) => !value);
    };
    const onOpen = () => setOpen(true);

    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_COMMAND_PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_COMMAND_PALETTE_EVENT, onOpen);
    };
  }, []);

  const commands = useMemo<Command[]>(() => {
    const email = siteConfig.links.email;
    const go = (href: string) => () => {
      router.push(href);
      return undefined;
    };

    return [
      ...routeConfig.map((route) => ({
        id: `nav:${route.path}`,
        group: "Navigate" as const,
        label: route.label,
        hint: route.path,
        icon: route.icon,
        run: go(route.path),
      })),
      ...projects.map((project) => ({
        id: `project:${project.slug}`,
        group: "Projects" as const,
        label: project.title,
        hint: [project.category, project.year].filter(Boolean).join(" · "),
        keywords: project.slug,
        icon: Icons.Palette.Project,
        run: go(`/work/${project.slug}`),
      })),
      {
        id: "action:copy-email",
        group: "Actions",
        label: "Copy email address",
        hint: email,
        keywords: "mail contact clipboard",
        icon: Icons.Palette.Copy,
        run: () => {
          navigator.clipboard?.writeText(email).catch(() => {});
          return `copied ${email} to clipboard`;
        },
      },
      {
        id: "action:resume",
        group: "Actions",
        label: "Open résumé",
        hint: "PDF",
        keywords: "resume cv pdf download",
        icon: Icons.Palette.Resume,
        run: () => {
          window.open(RESUME_URL, "_blank", "noopener");
          return undefined;
        },
      },
      {
        id: "action:theme",
        group: "Actions",
        label: `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`,
        keywords: "theme dark light appearance",
        icon: Icons.Palette.Theme,
        run: () => {
          setTheme(resolvedTheme === "dark" ? "light" : "dark");
          return undefined;
        },
      },
      {
        id: "action:hire",
        group: "Actions",
        label: "sudo hire --now",
        hint: "fastest path",
        keywords: "hire job role offer work together email",
        icon: Icons.Palette.Terminal,
        run: () => {
          window.location.href = `mailto:${email}?subject=${encodeURIComponent(
            "Let's work together",
          )}`;
          return "permission granted. opening mail client…";
        },
      },
      ...socialsConfig.map((social) => ({
        id: `social:${social.platform}`,
        group: "Elsewhere" as const,
        label: social.platform,
        hint: social.link.replace(/^https?:\/\/(www\.)?/, ""),
        icon: Icons.Social[social.icon],
        run: () => {
          window.open(social.link, "_blank", "noopener");
          return undefined;
        },
      })),
    ];
  }, [projects, resolvedTheme, router, setTheme]);

  const results = useMemo(() => {
    const trimmed = query.trim();
    const scored = commands
      .map((command) => ({
        command,
        score: Math.max(
          score(trimmed, command.label) * 2,
          score(trimmed, `${command.hint ?? ""} ${command.keywords ?? ""}`),
        ),
      }))
      .filter((entry) => entry.score > 0);

    if (trimmed) scored.sort((a, b) => b.score - a.score);
    else
      scored.sort(
        (a, b) =>
          GROUP_ORDER.indexOf(a.command.group) -
          GROUP_ORDER.indexOf(b.command.group),
      );
    return scored.map((entry) => entry.command);
  }, [commands, query]);

  // Reset selection whenever the result set changes shape.
  // biome-ignore lint/correctness/useExhaustiveDependencies: query is the trigger
  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    if (open) return;
    setQuery("");
    setFlash(null);
  }, [open]);

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const execute = (command: Command | undefined) => {
    if (!command) return;
    const message = command.run();
    if (message) {
      setFlash(message);
      window.setTimeout(() => setOpen(false), 900);
    } else {
      setOpen(false);
    }
  };

  const onInputKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => (index + 1) % Math.max(results.length, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(
        (index) =>
          (index - 1 + Math.max(results.length, 1)) %
          Math.max(results.length, 1),
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      execute(results[active]);
    }
  };

  let lastGroup: string | null = null;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-400 bg-background/60 backdrop-blur-sm transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup
          className="fixed top-[14vh] left-1/2 z-400 flex max-h-[min(560px,72vh)] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 flex-col overflow-hidden rounded-3xl border border-border bg-background text-foreground shadow-2xl outline-none transition-[opacity,transform] duration-200 ease-out data-ending-style:-translate-y-2 data-ending-style:opacity-0 data-starting-style:-translate-y-2 data-starting-style:opacity-0"
          initialFocus={() =>
            document.querySelector<HTMLInputElement>("[data-palette-input]")
          }
        >
          <Dialog.Title className="sr-only">Command palette</Dialog.Title>

          <div className="flex items-center gap-3 border-b border-border px-5 py-4 font-mono text-sm">
            <span className="shrink-0 text-foreground/45">
              ~/{siteConfig.author.toLowerCase()}
              <span className="text-emerald-500"> $</span>
            </span>
            <input
              data-palette-input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onInputKey}
              placeholder="jump to a page, project, or action…"
              aria-label="Search commands"
              aria-activedescendant={
                results[active] ? `cmd-${results[active].id}` : undefined
              }
              aria-controls="command-palette-list"
              role="combobox"
              aria-expanded
              spellCheck={false}
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent text-foreground caret-emerald-500 outline-none placeholder:text-foreground/30"
            />
            <kbd className="hidden shrink-0 rounded-md border border-border px-1.5 py-0.5 text-[10px] text-foreground/45 sm:block">
              esc
            </kbd>
          </div>

          {flash ? (
            <p className="px-5 py-6 font-mono text-sm text-emerald-500">
              <span className="text-foreground/40">{"> "}</span>
              {flash}
            </p>
          ) : (
            <div
              ref={listRef}
              id="command-palette-list"
              role="listbox"
              className="flex-1 overflow-y-auto overscroll-contain p-2"
            >
              {results.length === 0 ? (
                <p className="px-3 py-8 text-center font-mono text-xs text-foreground/45">
                  command not found: {query}
                </p>
              ) : (
                results.map((command, index) => {
                  const showGroup = command.group !== lastGroup;
                  lastGroup = command.group;
                  const IconComponent = command.icon;
                  const selected = index === active;

                  return (
                    <div key={command.id}>
                      {showGroup && !query.trim() ? (
                        <p className="px-3 pt-3 pb-1.5 font-mono text-[10px] tracking-[0.2em] text-foreground/40 uppercase">
                          {command.group}
                        </p>
                      ) : null}
                      <div
                        id={`cmd-${command.id}`}
                        role="option"
                        tabIndex={-1}
                        aria-selected={selected}
                        data-index={index}
                        onPointerMove={() => setActive(index)}
                        onClick={() => execute(command)}
                        onKeyDown={() => {}}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 font-mono text-sm transition-colors",
                          selected
                            ? "bg-accent text-foreground"
                            : "text-foreground/70",
                        )}
                      >
                        <IconComponent
                          className="size-4 shrink-0"
                          weight={selected ? "fill" : "regular"}
                        />
                        <span className="truncate">{command.label}</span>
                        {command.hint ? (
                          <span className="ml-auto truncate pl-3 text-[11px] text-foreground/40">
                            {command.hint}
                          </span>
                        ) : null}
                        <Icons.Generic.Forward
                          className={cn(
                            "size-3.5 shrink-0 transition-opacity",
                            command.hint ? "" : "ml-auto",
                            selected ? "opacity-60" : "opacity-0",
                          )}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          <div className="flex items-center gap-4 border-t border-border px-5 py-2.5 font-mono text-[10px] tracking-wide text-foreground/40">
            <span>
              <kbd className="text-foreground/60">↑↓</kbd> navigate
            </span>
            <span>
              <kbd className="text-foreground/60">↵</kbd> run
            </span>
            <span className="ml-auto hidden sm:inline">
              tip: try <span className="text-foreground/60">hire</span>
            </span>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
