import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const fraunces = localFont({
  src: [
    { path: "../fonts/Fraunces-Variable.ttf", weight: "300 900", style: "normal" },
    { path: "../fonts/Fraunces-Italic-Variable.ttf", weight: "300 900", style: "italic" },
  ],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = localFont({
  src: [{ path: "../fonts/Inter-Variable.ttf", weight: "100 900", style: "normal" }],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Crescent — Bespoke Furniture House | Rawalpindi",
    template: "%s | Crescent Bespoke Furniture House",
  },
  description:
    "Crescent is a bespoke handcrafted furniture house in Rawalpindi. Every piece made to order — living, dining, bedroom and commissioned work.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    apple: "/apple-touch-icon-180.png",
  },
  openGraph: {
    type: "website",
    siteName: "Crescent Bespoke Furniture House",
    images: [{ url: "/crescent-og-1200x630.png", width: 1200, height: 630 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#1c0a10",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
