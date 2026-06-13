export default function Maintenance() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-16">
      <section className="mx-auto w-full max-w-xl rounded-xl border border-border bg-card/60 p-8 text-center shadow-sm backdrop-blur">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Maintenance
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          We&apos;ll be back soon.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          The site is temporarily offline while we ship updates.
        </p>
      </section>
    </main>
  );
}
