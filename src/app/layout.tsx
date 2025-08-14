import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Base site URL for constructing absolute links used in metadata
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://iq-test-v2.vercel.app";
const ogAbsoluteUrl = `${siteUrl}/og`;

// Farcaster Mini App embed metadata (serialized into fc:miniapp)
const fcMiniApp = {
  version: "1",
  imageUrl: `${siteUrl}/miniapp-image`,
  button: {
    title: "Start IQ Test",
    action: {
      type: "launch_miniapp" as const,
      url: siteUrl,
      splashImageUrl: `${siteUrl}/icon.png`,
      splashBackgroundColor: "#4F46E5",
    },
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "IQ Test",
  description: "Test your IQ and get instant results",
  openGraph: {
    type: "website",
    url: "/",
    title: "IQ Test",
    description: "Test your IQ and get instant results",
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "IQ Test"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "IQ Test",
    description: "Test your IQ and get instant results",
    images: ["/og"]
  },
  other: {
    // Minimal Farcaster Frames tags (safe to remove if only targeting Mini Apps)
    "fc:frame": "vNext",
    "fc:frame:image": ogAbsoluteUrl,
    "fc:frame:button:1": "Start IQ Test",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": siteUrl,
    // Farcaster Mini App embed configuration for feed previews
    "fc:miniapp": JSON.stringify(fcMiniApp),
  }
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
