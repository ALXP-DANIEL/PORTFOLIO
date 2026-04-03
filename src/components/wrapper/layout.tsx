import GridPattern from "@/components/pattern/grid";
import { cn } from "@/lib/utils";

type LayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export default function LayoutWrapper({ children, className }: LayoutProps) {
  return (
    <>
      <GridPattern className="pointer-events-none absolute inset-0 -z-10 p-4" />
      <div
        className={cn(
          "relative z-10 min-h-screen w-full px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8",
          className,
        )}
      >
        {children}
      </div>
    </>
  );
}
