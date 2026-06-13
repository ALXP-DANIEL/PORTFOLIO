export const portfolioPages = [
  {
    href: "/work",
    label: "Work",
    title: "Selected Work",
    description:
      "Placeholder project highlights will live here, including case studies, shipped interfaces, and experiments worth documenting.",
  },
  {
    href: "/about",
    label: "About",
    title: "About Alif",
    description:
      "Placeholder biography content will live here, covering background, design direction, development focus, and current interests.",
  },
  {
    href: "/contact",
    label: "Contact",
    title: "Contact",
    description:
      "Placeholder contact content will live here, with ways to reach out, collaborate, or follow up about future work.",
  },
] as const;

export type PortfolioPage = (typeof portfolioPages)[number];
