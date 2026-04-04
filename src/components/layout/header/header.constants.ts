import type { Variants } from "motion/react";

export const primaryLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
] as const;

export const mobileMenuListVariants: Variants = {
  hidden: {
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
  visible: {
    transition: {
      delayChildren: 0.04,
      staggerChildren: 0.06,
    },
  },
};

export const mobileMenuItemVariants: Variants = {
  hidden: { opacity: 0, y: -8, filter: "blur(2px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.18, ease: "easeOut" },
  },
};

export function isLinkActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === href;
  }

  return pathname.startsWith(href);
}
