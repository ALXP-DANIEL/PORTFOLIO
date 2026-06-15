import WorkPage from "@/app/work/page";
import { createPageMetadata } from "@/lib/metadata";
import Hero from "./_components/hero";

export const metadata = createPageMetadata({
  path: "/",
  title: "Home",
  type: "Portfolio",
});

export default function Home() {
  return (
    <div className="space-y-32 sm:space-y-40">
      <Hero />
      <WorkPage />
      {/* <AboutPage />
      <ContactPage /> */}
    </div>
  );
}
