import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Pinyon_Script } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// Body copy and the letterspaced headings.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// The couple's names and the flourished capitals, after the printed card.
const pinyon = Pinyon_Script({
  variable: "--font-pinyon",
  subsets: ["latin"],
  weight: "400",
});

/*
  Link previews need an absolute image URL. On Vercel this is the production
  domain, set by Vercel itself; locally it falls back to the dev server.

  The tab icon, the Apple icon and the share image are files in this folder
  (icon.png, apple-icon.png, opengraph-image.jpg), which Next picks up on its own.
*/
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Praise & Theophilus | 05 December 2026",
  description:
    "The wedding of Praise and Theophilus. Saturday 5 December 2026, Gwagwalada, Abuja.",
  openGraph: {
    title: "Praise & Theophilus",
    description: "Saturday 5 December 2026, Gwagwalada, Abuja. You are invited.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3e2318",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the inline script adds `js` to this element before React hydrates.
    <html lang="en" suppressHydrationWarning className={`${cormorant.variable} ${pinyon.variable} antialiased`}>
      <head>
        {/* Runs before first paint, so animated elements start hidden only when JavaScript is on. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
