import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "@styles/globals.css";
import CommandPaletteRoot from "@/components/command-palette";
import { ConsoleGreeting } from "@/components/console-greeting";
import { DebugInfo } from "@/components/debug-info";
import RootLayoutWrapper from "@/components/layouts/root-layout";
import SplashGate from "@/components/layouts/splash-gate";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ReducedMotionGuard } from "@/components/reduced-motion-guard";
import { siteConfig } from "@/config/site";
import { env } from "@/env";
import { PageScrollStateProvider } from "@/hooks/use-page-scroll-state";
import { cn } from "@/lib/utils";
import Maintenance from "./maintenance";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url.base),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author, url: siteConfig.links.github }],
  creator: siteConfig.author,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  other: {
    "github:repo": siteConfig.links.github,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  alternateName: siteConfig.author,
  url: siteConfig.url.base,
  jobTitle: "Full-Stack Web Developer",
  description: siteConfig.description,
  sameAs: Object.values(siteConfig.links).filter((link) =>
    link.startsWith("http"),
  ),
};

const isMaintenance = env.IS_MAINTENANCE === "true";
const isDevelopment = env.NODE_ENV === "development";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        "font-mono",
        jetbrainsMono.variable,
      )}
    >
      <head>
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD built from our own site config, no user input
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ReducedMotionGuard />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <PageScrollStateProvider>
            {isMaintenance ? (
              <Maintenance />
            ) : (
              <>
                <SplashGate>
                  <RootLayoutWrapper>{children}</RootLayoutWrapper>
                </SplashGate>
                <CommandPaletteRoot />
                <ConsoleGreeting />
              </>
            )}
            <DebugInfo enabled={isDevelopment} />
          </PageScrollStateProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
