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
      <Navigation />
      <GridBackground>
        <main className="min-h-dvh py-20 px-4">
          <PageTransition>{children}</PageTransition>
        </main>
      </GridBackground>
      <Footer />
    </>
  );
}
