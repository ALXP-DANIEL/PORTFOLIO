"use client";

import { useEffect } from "react";
import { siteConfig } from "@/config/site";

let greeted = false;

/** A small hello for the people who open devtools on a portfolio. */
export function ConsoleGreeting() {
  useEffect(() => {
    if (greeted) return;
    greeted = true;

    const title =
      "font:600 14px/1.6 ui-monospace,monospace;color:#10b981;padding:4px 0";
    const body = "font:12px/1.7 ui-monospace,monospace;color:inherit";

    console.log(
      `%c> whoami\n%c${siteConfig.author} — full-stack web developer.\nPoking around the source? Same energy.\n\n  ⌘K / Ctrl+K   command palette\n  sudo hire     inside the palette, try it\n  ${siteConfig.links.email}\n`,
      title,
      body,
    );
  }, []);

  return null;
}
