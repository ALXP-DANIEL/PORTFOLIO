import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { memo } from "react";

import {
  isLinkActive,
  mobileMenuItemVariants,
  mobileMenuListVariants,
  primaryLinks,
} from "@/components/layout/header.constants";
import { cn } from "@/lib/utils";

type HeaderMobileMenuProps = {
  isOpen: boolean;
  pathname: string;
  onNavigate: () => void;
};

function HeaderMobileMenu({
  isOpen,
  pathname,
  onNavigate,
}: HeaderMobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute right-0 top-full z-30 mt-3 w-48 origin-top-right sm:hidden"
        >
          <div className="rounded-[1.75rem] border border-border/60 bg-background/90 p-2 shadow-[0_16px_40px_-24px_rgba(0,0,0,0.55)] backdrop-blur-md">
            <motion.div
              variants={mobileMenuListVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex flex-col gap-1"
            >
              {primaryLinks.map((link) => {
                const isActive = isLinkActive(pathname, link.href);

                return (
                  <motion.div key={link.href} variants={mobileMenuItemVariants}>
                    <Link
                      href={link.href}
                      transitionTypes={["page"]}
                      onClick={onNavigate}
                      className={cn(
                        "block w-full rounded-[1.25rem] px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                        isActive && "bg-muted text-foreground",
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default memo(HeaderMobileMenu);
