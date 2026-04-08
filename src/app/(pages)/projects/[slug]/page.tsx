import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import BlurImage from "@/components/ui/blur-image";
import SectionWrapper from "@/components/wrapper/section";
import { siteConfig } from "@/config/site";
import {
  getAllProjectParams,
  getPreviewImageSrc,
  getProjectBySlug,
  type ProjectDetail,
} from "@/data/projects/projects-data";

type ProjectDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const getPreviewMeta = (
  image: ProjectDetail["previewImages"][number],
  index: number,
) => {
  if (typeof image === "string") {
    return {
      src: image,
      alt: `Project preview ${index + 1}`,
      title: `Preview ${index + 1}`,
      caption: "Selected product interface preview.",
    };
  }

  return {
    src: image.src,
    alt: image.alt ?? `Project preview ${index + 1}`,
    title: image.title ?? `Preview ${index + 1}`,
    caption: image.caption ?? "Selected product interface preview.",
  };
};

export function generateStaticParams() {
  return getAllProjectParams();
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const heroImage = getPreviewImageSrc(project.previewImages[0]);
  const title = `${project.title} | Projects`;

  return {
    title,
    description: project.summary,
    openGraph: {
      title: `${siteConfig.name} | ${project.title}`,
      description: project.summary,
      url: `/projects/${project.slug}`,
      images: [heroImage],
    },
    twitter: {
      title,
      description: project.summary,
      images: [heroImage],
    },
  };
}

const pillClassName =
  "inline-flex items-center rounded-full border border-border/70 bg-background/80 px-3 py-1 text-sm text-foreground";

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const heroImage = getPreviewMeta(project.previewImages[0], 0);
  const quickFacts = [
    {
      label: "Category",
      value: project.type,
    },
    {
      label: "Year",
      value: project.year,
    },
    {
      label: "Signal",
      value: project.stat,
    },
  ];

  return (
    <div className="space-y-6">
      <SectionWrapper className="border border-border/70 bg-background/70 px-5 py-6 sm:px-7 sm:py-8">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.75fr)] xl:items-center">
          <div className="space-y-6">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <span aria-hidden="true">&lt;</span>
              Back to projects
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              <span className={pillClassName}>{project.kicker}</span>
              {project.featured ? (
                <span className={pillClassName}>Spotlight</span>
              ) : null}
              <span className={pillClassName}>
                {project.previewImages.length} previews
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">
                {project.title}
              </h1>
              <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
                {project.summary}
              </p>
              <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                {project.overview}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {quickFacts.map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-[1.4rem] border border-border/70 bg-background/80 py-0"
                >
                  <div className="px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      {fact.label}
                    </p>
                    <p className="mt-2 text-lg font-medium tracking-tight text-foreground">
                      {fact.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/projects#all-projects"
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Browse library
                <span aria-hidden="true">/</span>
              </Link>

              <a
                href="#project-gallery"
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Preview gallery
              </a>

              <a
                href={project.actions.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                GitHub
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.8rem] border border-border/70 bg-muted/35 shadow-[0_28px_65px_-34px_rgba(0,0,0,0.7)]">
            <BlurImage
              src={heroImage.src}
              alt={heroImage.alt}
              wrapperClassName="block h-full w-full"
              className="h-full min-h-[20rem] w-full object-cover"
              eager
            />
          </div>
        </div>
      </SectionWrapper>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section id="project-gallery">
          <SectionWrapper className="border border-border/70 bg-background/70 px-5 py-6 sm:px-7 sm:py-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Detail Gallery
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  Product screens and key moments
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                {project.previewImages.length} curated previews
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {project.previewImages.map((image, index) => {
                const preview = getPreviewMeta(image, index);

                return (
                  <article
                    key={preview.src}
                    className="overflow-hidden rounded-[1.6rem] border border-border/70 bg-background/80 py-0"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-muted/40">
                      <BlurImage
                        src={preview.src}
                        alt={preview.alt}
                        wrapperClassName="block h-full w-full"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="space-y-2 px-5 py-5">
                      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                        Preview {index + 1}
                      </p>
                      <h3 className="text-xl font-medium tracking-tight">
                        {preview.title}
                      </h3>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {preview.caption}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </SectionWrapper>
        </section>

        <div className="space-y-6">
          <SectionWrapper className="border border-border/70 bg-background/70 px-5 py-6 sm:px-6">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Project Highlights
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                What makes this build strong
              </h2>
            </div>
            <div className="my-5 h-px bg-border" />
            <ul className="space-y-4">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3 text-sm leading-6">
                  <span className="mt-2 size-2 shrink-0 rounded-full bg-foreground/85" />
                  <span className="text-muted-foreground">{highlight}</span>
                </li>
              ))}
            </ul>
          </SectionWrapper>

          <SectionWrapper className="border border-border/70 bg-background/70 px-5 py-6 sm:px-6">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Stack
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Tools behind the experience
              </h2>
            </div>
            <div className="my-5 h-px bg-border" />
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((item) => (
                <span key={item} className={pillClassName}>
                  {item}
                </span>
              ))}
            </div>
          </SectionWrapper>
        </div>
      </div>
    </div>
  );
}
