import Footer from "@/components/layout/footer/footer";
import Header from "@/components/layout/header/header";
import GridPattern from "@/components/pattern/grid";
import ViewTransitionShell from "@/components/wrapper/view-transition-shell";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "../ui/shadcn/tooltip";

type LayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export default function LayoutWrapper({ children, className }: LayoutProps) {
  return (
    <div className="relative">
      <TooltipProvider>
        <GridPattern className="pointer-events-none absolute inset-0 -z-10 p-4" />
        <div
          className={cn(
            "relative z-10 flex min-h-dvh w-full flex-col px-4 py-4 transition-[padding] duration-300 ease-out motion-reduce:transition-none sm:px-6 sm:py-6 lg:px-8 lg:py-8",
            className,
          )}
        >
          <Header />

          <main className="flex flex-1 flex-col pb-40 sm:pb-48">
            <ViewTransitionShell>{children}</ViewTransitionShell>
          </main>

          <Footer />
        </div>
      </TooltipProvider>
    </div>
  );
}
