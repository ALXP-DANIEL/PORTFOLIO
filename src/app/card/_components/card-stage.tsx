"use client";

import { useState } from "react";
import { Icons } from "@/components/icons";
import { buildVCard, cardContact } from "./card-data";
import LanyardCard from "./lanyard-card";

const buttonClass =
  "inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 font-mono text-xs tracking-wide text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground";

export default function CardStage() {
  const [flipped, setFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  const saveContact = () => {
    const blob = new Blob([buildVCard()], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "alxp-daniel.vcf";
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(cardContact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — the card still shows the address */
    }
  };

  return (
    <div className="-mt-25 flex flex-col items-center">
      <LanyardCard
        flipped={flipped}
        onFlip={() => setFlipped((value) => !value)}
      />

      <div className="flex flex-col items-center gap-5">
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            data-reticle
            onClick={() => setFlipped((value) => !value)}
            className={buttonClass}
          >
            Flip
          </button>
          <button
            type="button"
            data-reticle
            onClick={saveContact}
            className={buttonClass}
          >
            Save contact
          </button>
          <button
            type="button"
            data-reticle
            onClick={copyEmail}
            className={buttonClass}
          >
            <Icons.Palette.Copy className="size-3.5" />
            {copied ? "Copied ✓" : "Copy email"}
          </button>
        </div>
        <p className="font-mono text-[11px] tracking-wide text-foreground/45">
          drag it, throw it, click to flip
        </p>
      </div>
    </div>
  );
}
