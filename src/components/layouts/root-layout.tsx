import Footer from "./footer";
import GridBackground from "./grid-background";
import Navigation from "./navigation";
import ViewTransitionShell from "./view-transition-shell";

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayoutWrapper({ children }: RootLayoutProps) {
  return (
    <GridBackground>
      <Navigation />
      <main className="min-h-dvh py-20 px-5 lg:px-15">
        <ViewTransitionShell>
          <section className="space-y-12 mx-auto max-w-6xl ">
            {children}
          </section>
        </ViewTransitionShell>
      </main>
      <Footer />
    </GridBackground>
  );
}
