import Footer from "./footer";
import GridBackground from "./grid-background";
import Navigation from "./navigation";
import PageTransition from "./page-transition";

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayoutWrapper({ children }: RootLayoutProps) {
  return (
    <>
      <GridBackground>
        <Navigation />
        <main className="min-h-dvh py-20 px-5 lg:px-15">
          <PageTransition>
            <section className="space-y-12">{children}</section>
          </PageTransition>
        </main>
        <Footer />
      </GridBackground>
    </>
  );
}
