import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/metadata";
import CardStage from "./_components/card-stage";

// Reachable by link (e.g. from the printed card's QR), but kept out of the
// navbar, the command palette, the sitemap and search results.
export const metadata: Metadata = {
  ...createPageMetadata({
    path: "/card",
    title: "Card",
    description: "Digital business card — save my contact in one tap.",
    type: "Card",
  }),
  robots: { index: false, follow: false },
};

export default function CardPage() {
  return <CardStage />;
}
