import { createPageMetadata } from "@/lib/metadata";
import ContactBody from "./_components/contact-body";

export const metadata = createPageMetadata({
  path: "/contact",
  title: "Contact",
  description: "Get in touch — email, phone, or save my contact card.",
  type: "Contact",
});

export default function ContactPage() {
  return <ContactBody />;
}
