import { cn } from "@/lib/utils";

type HeaderSectionProps = {
  children: React.ReactNode;
  className?: string;
};

export default function HeaderSection({
  children,
  className,
}: HeaderSectionProps) {
  return (
    <div
      className={cn(
        "flex min-h-14 items-center rounded-full border border-border/60 bg-background/70 shadow-[0_12px_32px_-24px_rgba(0,0,0,0.45)] backdrop-blur-md",
        className,
      )}
    >
      {children}
    </div>
  );
}
