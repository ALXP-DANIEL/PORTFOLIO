import PageIntro from "@/components/page-intro";
import { createPageMetadata } from "@/lib/metadata";
import ContactBody from "./_components/contact-body";

export const metadata = createPageMetadata({
  path: "/contact",
  title: "Contact",
  description: "Get in touch — open to roles, projects, and collaborations.",
  type: "Contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-14 sm:gap-20">
      <PageIntro
        title="Contact"
        description="Open to full-time roles, freelance projects, and collaborations. The fastest way to reach me is email."
      />
      <ContactBody />
    </div>
  );
}
