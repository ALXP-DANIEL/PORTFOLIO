import type { Metadata } from "next";
import { getFeaturedProjects, getProjects } from "@/lib/work";
import WorkIndex from "./_components/work-index";
import WorkIntro from "./_components/work-intro";
import WorkRefresh from "./_components/work-refresh";
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
    <div className="space-y-20">
      <WorkIntro />
      {featured.length > 0 ? <WorkSpotlight projects={featured} /> : null}
      <WorkIndex projects={projects} />
      <WorkRefresh />
    </div>
  );
}
