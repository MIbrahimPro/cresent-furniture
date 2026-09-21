import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const cinzel = localFont({
  src: [
    { path: "../fonts/Cinzel-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/Cinzel-Medium.ttf", weight: "500", style: "normal" },
    { path: "../fonts/Cinzel-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../fonts/Cinzel-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-cinzel",
  display: "swap",
});

const garamond = localFont({
  src: [
    { path: "../fonts/EBGaramond-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/EBGaramond-Medium.ttf", weight: "500", style: "normal" },
    { path: "../fonts/EBGaramond-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../fonts/EBGaramond-Italic.ttf", weight: "400", style: "italic" },
  ],
  variable: "--font-garamond",
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
  themeColor: "#3D141E",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${garamond.variable}`}>
      <body>{children}</body>
    </html>
  );
}
