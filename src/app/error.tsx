"use client";

import { useEffect } from "react";
import StatusPage from "@/components/layouts/status-page";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusPage
      code="500"
      eyebrow="Something broke"
      title="That wasn't supposed to happen."
      description="An unexpected error interrupted this page. Try again, or head back home if it keeps happening."
      actions={[
        { label: "Try again", onClick: reset, variant: "primary" },
        { href: "/", label: "Back home", variant: "secondary" },
      ]}
    />
  );
}
