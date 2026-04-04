import { AnimatePresence, motion } from "motion/react";

import { Icons } from "@/components/icons/icons";

type HeaderMobileToggleProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export default function HeaderMobileToggle({
  isOpen,
  onToggle,
}: HeaderMobileToggleProps) {
  return (
    <motion.button
      type="button"
      aria-expanded={isOpen}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      onClick={onToggle}
      whileHover={{ y: -1, scale: 1.03 }}
      whileTap={{ y: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
      className="flex size-14 items-center justify-center rounded-full border border-border/60 bg-background/70 text-foreground shadow-[0_12px_32px_-24px_rgba(0,0,0,0.45)] backdrop-blur-md transition-colors hover:bg-muted sm:hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isOpen ? (
          <motion.span
            key="close"
            initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute"
          >
            <Icons.close weight="bold" className="size-5" />
          </motion.span>
        ) : (
          <motion.span
            key="menu"
            initial={{ opacity: 0, rotate: 90, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -90, scale: 0.6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute"
          >
            <Icons.menu weight="bold" className="size-5" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
