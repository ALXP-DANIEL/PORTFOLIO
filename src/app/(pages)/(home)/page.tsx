import WorkPage from "@/app/work/page";
import { createPageMetadata } from "@/lib/metadata";
import { getProjects } from "@/lib/work";
import Hero from "./_components/hero";
import HomeStory from "./_components/home-story";

export const metadata = createPageMetadata({
  path: "/",
  title: "Home",
  type: "Portfolio",
});

export default async function Home() {
  const projects = await getProjects();

  return (
    <div className="space-y-32 sm:space-y-40">
      <Hero />
      <WorkPage />
      <HomeStory projectCount={projects.length} />
    </div>
  );
}
