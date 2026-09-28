import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const fraunces = localFont({
  src: [
    { path: "../fonts/Fraunces-Variable.ttf", weight: "100 900", style: "normal" },
    { path: "../fonts/Fraunces-Italic-Variable.ttf", weight: "100 900", style: "italic" },
  ],
  variable: "--font-fraunces",
  display: "swap",
});

const merriweather = localFont({
  src: [
    { path: "../fonts/Merriweather-Variable.ttf", weight: "100 900", style: "normal" },
    { path: "../fonts/Merriweather-Italic-Variable.ttf", weight: "100 900", style: "italic" },
  ],
  variable: "--font-merriweather",
  display: "swap",
});

const archivo = localFont({
  src: [{ path: "../fonts/Archivo-Variable.ttf", weight: "100 900", style: "normal" }],
  variable: "--font-archivo",
  display: "swap",
});

const marcellus = localFont({
  src: [{ path: "../fonts/Marcellus-Regular.ttf", weight: "400", style: "normal" }],
  variable: "--font-marcellus",
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
    icon: [{ url: "/favicon.ico", sizes: "48x48" }],
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Crescent Bespoke Furniture House",
    images: [{ url: "/crescent-og-1200x630.png", width: 1200, height: 630 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f3ec",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${merriweather.variable} ${archivo.variable} ${marcellus.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
