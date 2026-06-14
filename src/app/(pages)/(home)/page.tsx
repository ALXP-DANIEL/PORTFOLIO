import AboutPage from "@/app/about/page";
import ContactPage from "@/app/contact/page";
import WorkPage from "@/app/work/page";

export default function Home() {
  return (
    <>
      <section className="mx-auto flex min-h-[calc(100dvh-10rem)] w-full max-w-4xl flex-col justify-center gap-5 py-16">
        <p className="font-mono text-xs tracking-[0.24em] text-foreground/40 uppercase">
          Portfolio
        </p>
        <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-foreground sm:text-7xl">
          Alif
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-foreground/58 sm:text-base">
          Placeholder home introduction. This page previews every section, while
          the navigation opens each page directly.
        </p>
      </section>

      <WorkPage />

      <AboutPage />

      <ContactPage />
    </>
  );
}
