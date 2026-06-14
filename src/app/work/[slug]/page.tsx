import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WorkDetailView from "@/app/work/_components/work-detail-view";
import { getProject, getProjects, getProjectWithIndex } from "@/lib/work";

type WorkDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: WorkDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.title} · Work`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({
  params,
}: WorkDetailPageProps) {
  const { slug } = await params;
  const found = await getProjectWithIndex(slug);

  if (!found) {
    notFound();
  }

  return (
    <WorkDetailView
      project={found.project}
      index={found.index}
      projects={found.projects}
    />
  );
}
