import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import GridPattern from "@/components/pattern/grid";
import { cn } from "@/lib/utils";

type LayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export default function LayoutWrapper({ children, className }: LayoutProps) {
  return (
    <div className="relative min-h-dvh">
      <GridPattern className="pointer-events-none absolute inset-0 -z-10 p-4" />
      <div
        className={cn(
          "relative z-10 w-full px-4 py-4 transition-[padding] duration-300 ease-out motion-reduce:transition-none sm:px-6 sm:py-6 lg:px-8 lg:py-8",
          className,
        )}
      >
        <Header />

        <main className="pb-40 sm:pb-48">{children}</main>

        <Footer />
      </div>
    </div>
  );
}
