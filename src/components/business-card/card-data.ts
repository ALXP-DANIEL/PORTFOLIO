import { siteConfig } from "@/config/site";

export const cardContact = {
  fullName: "Muhammad Alif Daniel",
  fullNameSuffix: "Bin Mohd Hairul Hezzelin",
  title: "Full-Stack Web Developer",
  phone: "+60 11-7018 8796",
  phoneHref: "tel:+601170188796",
  email: siteConfig.links.email,
  github: "github.com/ALXP-DANIEL",
  web: "alifdaniel.dpdns.org",
  webUrl: "https://alifdaniel.dpdns.org",
} as const;

/** 29×29 module QR for https://alifdaniel.dpdns.org, one stroke per row run. */
export const QR_PATH =
  "M0 0.5h7m6 0h1m2 0h4m2 0h7M0 1.5h1m5 0h1m3 0h6m2 0h1m3 0h1m5 0h1M0 2.5h1m1 0h3m1 0h1m2 0h2m1 0h2m2 0h3m1 0h1m1 0h1m1 0h3m1 0h1M0 3.5h1m1 0h3m1 0h1m2 0h2m2 0h3m2 0h2m2 0h1m1 0h3m1 0h1M0 4.5h1m1 0h3m1 0h1m2 0h2m2 0h2m1 0h1m5 0h1m1 0h3m1 0h1M0 5.5h1m5 0h1m1 0h2m3 0h2m2 0h1m1 0h2m1 0h1m5 0h1M0 6.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M9 7.5h1m1 0h1m2 0h1m2 0h2M0 8.5h1m2 0h1m1 0h2m1 0h1m1 0h3m2 0h1m2 0h1m1 0h2m1 0h1M1 9.5h3m3 0h2m1 0h1m3 0h2m4 0h3m2 0h1m2 0h1M1 10.5h1m1 0h4m1 0h1m1 0h3m3 0h2m1 0h3m3 0h3M1 11.5h1m1 0h1m3 0h1m1 0h3m2 0h2m3 0h1m1 0h1m1 0h1m2 0h2M0 12.5h1m1 0h1m1 0h5m1 0h1m5 0h2m2 0h3m2 0h1m1 0h2M0 13.5h2m2 0h1m3 0h2m1 0h2m2 0h1m3 0h3M1 14.5h3m1 0h3m1 0h1m1 0h1m3 0h2m5 0h1m1 0h5M0 15.5h1m2 0h1m1 0h1m1 0h1m2 0h1m2 0h2m1 0h3m1 0h1m2 0h3m1 0h1M1 16.5h1m1 0h1m2 0h1m1 0h2m1 0h1m1 0h5m2 0h2m5 0h1M4 17.5h2m5 0h2m2 0h1m2 0h1m1 0h4m1 0h1m2 0h1M0 18.5h1m1 0h2m2 0h1m3 0h2m1 0h1m3 0h2m1 0h2m2 0h1m2 0h2M2 19.5h4m2 0h3m1 0h2m1 0h3m2 0h2m2 0h1m2 0h2M0 20.5h1m1 0h2m1 0h3m1 0h1m2 0h1m1 0h1m1 0h1m2 0h6m1 0h1M8 21.5h1m1 0h1m2 0h1m1 0h3m1 0h2m3 0h1m1 0h3M0 22.5h7m2 0h1m1 0h5m1 0h1m2 0h1m1 0h1m1 0h1m2 0h1M0 23.5h1m5 0h1m1 0h2m1 0h3m2 0h1m1 0h1m1 0h1m3 0h4M0 24.5h1m1 0h3m1 0h1m2 0h2m3 0h2m2 0h1m1 0h5m2 0h1M0 25.5h1m1 0h3m1 0h1m1 0h1m1 0h7m2 0h1m2 0h5m1 0h1M0 26.5h1m1 0h3m1 0h1m2 0h1m1 0h3m5 0h1m4 0h3m1 0h1M0 27.5h1m5 0h1m2 0h1m2 0h1m1 0h2m3 0h4m4 0h1M0 28.5h7m1 0h4m1 0h2m5 0h2m2 0h2m1 0h1";

/** vCard 3.0 so "Save contact" drops straight into a phone's address book. */
export function buildVCard() {
  const c = cardContact;
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:;${c.fullName} ${c.fullNameSuffix};;;`,
    `FN:${c.fullName}`,
    `TITLE:${c.title}`,
    `TEL;TYPE=CELL:${c.phoneHref.replace("tel:", "")}`,
    `EMAIL;TYPE=INTERNET:${c.email}`,
    `URL:${c.webUrl}`,
    `X-SOCIALPROFILE;TYPE=github:https://${c.github}`,
    "END:VCARD",
  ].join("\r\n");
}
