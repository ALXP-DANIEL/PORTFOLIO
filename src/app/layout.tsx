import { Geist, JetBrains_Mono } from "next/font/google";

import "@/styles/globals.css";
import ThemeProvider from "@/components/provider/theme";
import LayoutWrapper from "@/components/wrapper/layout";
import { cn } from "@/lib/utils";

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
      <body className="min-h-dvh bg-background">
        <ThemeProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
