import type { Metadata } from "next";
import PageIntro from "@/components/page-intro";
import AboutBody from "./_components/about-body";

export const metadata: Metadata = {
  title: "About",
  description:
    "Full-stack web developer — experience, skills, and the path so far.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-14 sm:gap-20">
      <PageIntro
        title="About"
        description="Here's a bit about my background, experience, and skills."
      />
      <AboutBody />
    </div>
  );
}
