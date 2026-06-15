import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "@styles/globals.css";
import { DebugInfo } from "@/components/debug-info";
import RootLayoutWrapper from "@/components/layouts/root-layout";
import SplashGate from "@/components/layouts/splash-gate";
import { siteConfig } from "@/config/site";
import { env } from "@/env";
import { cn } from "@/lib/utils";
import Maintenance from "./maintenance";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        "dark",
        geistSans.variable,
        geistMono.variable,
        "font-mono",
        jetbrainsMono.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        {isMaintenance ? (
          <Maintenance />
        ) : (
          <SplashGate>
            <RootLayoutWrapper>{children}</RootLayoutWrapper>
          </SplashGate>
        )}
        <DebugInfo enabled={isDevelopment} />
      </body>
    </html>
  );
}
