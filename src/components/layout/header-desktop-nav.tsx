import { LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import { memo } from "react";

import {
  isLinkActive,
  primaryLinks,
} from "@/components/layout/header.constants";
import { cn } from "@/lib/utils";

type HeaderDesktopNavProps = {
  pathname: string;
  onNavigate: () => void;
};

function HeaderDesktopNav({ pathname, onNavigate }: HeaderDesktopNavProps) {
  return (
    <>
      {primaryLinks.map((link) => {
        const isActive = isLinkActive(pathname, link.href);

        return (
          <motion.div
            key={link.href}
            layout
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ y: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="relative"
          >
            {isActive ? (
              <motion.span
                layoutId="desktop-nav-active"
                className="absolute inset-0 rounded-full bg-muted"
                transition={{ type: "spring", stiffness: 360, damping: 30 }}
              />
            ) : null}

            <Link
              href={link.href}
              onClick={onNavigate}
              className={cn(
                "relative z-10 block rounded-full px-3 py-1.5 transition-colors duration-300 hover:text-foreground",
                isActive && "text-foreground",
              )}
            >
              {link.label}
            </Link>
          </motion.div>
        );
      })}
    </>
  );
}

function HeaderDesktopNavWithLayout(props: HeaderDesktopNavProps) {
  return (
    <LayoutGroup id="desktop-nav">
      <HeaderDesktopNav {...props} />
    </LayoutGroup>
  );
}

export default memo(HeaderDesktopNavWithLayout);
