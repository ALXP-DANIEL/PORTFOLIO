import { cn } from "@/lib/utils";

type SectionWrapperProps = {
  children?: React.ReactNode;
  className?: string;
  withBlur?: boolean;
};

export default function SectionWrapper({
  children,
  className,
  withBlur = true,
}: SectionWrapperProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[2rem]",
        withBlur &&
          "opacity-70 backdrop-blur-lg "+
        className,
      )}
    >
      {children}
    </section>
  );
}
