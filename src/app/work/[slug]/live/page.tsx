import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import ProjectLive from "@/app/work/_components/project-live";
import { createPageMetadata } from "@/lib/metadata";
import { getProject, getProjects } from "@/lib/work";

type LivePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects
    .filter((project) => project.embeddable)
    .map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: LivePageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  const title = project ? `${project.title} — Live` : "Live preview";

  return {
    ...createPageMetadata({
      path: `/work/${slug}/live`,
      title,
      description: project?.summary,
      type: "Live",
    }),
    // The real site is the canonical page for its own content.
    robots: { index: false, follow: true },
  };
}

export default async function ProjectLivePage({ params }: LivePageProps) {
  const { slug } = await params;
  const project = await getProject(slug);
  const url = project?.actions.open;

  if (!project || !url) notFound();
  // Sites that refuse to be framed just go to the real thing.
  if (!project.embeddable) redirect(url);

  return <ProjectLive slug={project.slug} title={project.title} url={url} />;
}
