import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";

import "@/styles/globals.css";
import ThemeProvider from "@/components/provider/theme";
import LayoutWrapper from "@/components/wrapper/layout";
import SplashGate from "@/components/wrapper/splash-gate";
import { siteConfig } from "@/config/site";
import { env } from "@/env";
import { cn } from "@/lib/utils";
import Maintenance from "./maintenance";

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

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isMaintenance = env.IS_MAINTENANCE === "true";

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased overscroll-none font-mono",
        fontSans.variable,
        jetbrainsMono.variable,
      )}
    >
      <body className="min-h-dvh bg-background scroll-smooth">
        <ThemeProvider attribute="class" defaultTheme="dark">
          {isMaintenance ? (
            <Maintenance />
          ) : (
            <SplashGate>
              <LayoutWrapper>{children}</LayoutWrapper>
            </SplashGate>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
