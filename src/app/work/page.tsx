import type { Metadata } from "next";
import { getFeaturedProjects, getProjects } from "@/lib/work";
import WorkGrid from "./_components/work-grid";
import WorkIntro from "./_components/work-intro";
import WorkSpotlight from "./_components/work-spotlight";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected work — products, tools, and experiments.",
};

export default async function WorkPage() {
  const [projects, featured] = await Promise.all([
    getProjects(),
    getFeaturedProjects(),
  ]);

  return (
    <>
      <WorkIntro count={projects.length} />
      {featured.length > 0 ? <WorkSpotlight projects={featured} /> : null}
      <WorkGrid projects={projects} />
    </>
  );
}
