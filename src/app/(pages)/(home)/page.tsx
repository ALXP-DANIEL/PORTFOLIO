import AboutPage from "@/app/about/page";
import ContactPage from "@/app/contact/page";
import WorkPage from "@/app/work/page";
import Hero from "./_components/hero";

export default function Home() {
  return (
    <div className="flex flex-col gap-32 sm:gap-52">
      <Hero />
      <WorkPage />
      {/* <AboutPage />
      <ContactPage /> */}
    </div>
  );
}
