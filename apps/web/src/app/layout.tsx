import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import type { ReactNode } from "react";

import { SiteChrome } from "@/components/layout/site-chrome";
import { siteConfig } from "@/config/site";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      "http://localhost:3000",
  ),

  title: {
    default: `${siteConfig.name} — Smarter Tools for Students`,
    template: `%s | ${siteConfig.name}`,
  },

  description: siteConfig.description,

  applicationName: siteConfig.name,

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    title: `${siteConfig.name} — Smarter Tools for Students`,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },

  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Smarter Tools for Students`,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable}`}
    >
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>

        <SiteChrome position="header" />

        <div id="main-content">
          {children}
        </div>

        <SiteChrome position="footer" />
      </body>
    </html>
  );
}
