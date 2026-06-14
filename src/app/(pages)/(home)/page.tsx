import AboutPage from "@/app/about/page";
import ContactPage from "@/app/contact/page";
import WorkPage from "@/app/work/page";
import Hero from "./_components/hero";

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
