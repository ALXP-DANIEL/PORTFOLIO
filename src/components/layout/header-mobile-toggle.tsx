import { List, X } from "@phosphor-icons/react";

type HeaderMobileToggleProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export default function HeaderMobileToggle({
  isOpen,
  onToggle,
}: HeaderMobileToggleProps) {
  return (
    <button
      type="button"
      aria-expanded={isOpen}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      onClick={onToggle}
      className="flex size-14 items-center justify-center rounded-full border border-border/60 bg-background/70 text-foreground shadow-[0_12px_32px_-24px_rgba(0,0,0,0.45)] backdrop-blur-md transition-colors hover:bg-muted sm:hidden"
    >
      {isOpen ? (
        <X weight="bold" className="size-5" />
      ) : (
        <List weight="bold" className="size-5" />
      )}
    </button>
  );
}
