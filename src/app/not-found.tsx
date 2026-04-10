import StatusPage from "@/components/ui/status-page";

export default function NotFound() {
  return (
    <StatusPage
      code="404"
      eyebrow="Page not found"
      title="This page drifted out of range."
      description="The link may be old, the address may be mistyped, or the page you were looking for no longer lives here."
      actions={[
        {
          href: "/",
          label: "Back home",
        },
      ]}
    />
  );
}
