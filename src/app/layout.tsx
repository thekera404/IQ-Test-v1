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

// Farcaster frame metadata object
const frameMetadata = {
  version: "next",
  imageUrl: "https://iq-test-v1.vercel.app/image.png",
  button: {
    title: "Start IQ Test",
    action: {
      type: "launch_frame",
      name: "IQ Test",
      url: "https://iq-test-v1.vercel.app",
      splashImageUrl: "https://iq-test-v1.vercel.app/icon.png",
      splashBackgroundColor: "#4F46E5"
    }
  }
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://iq-test-v1.vercel.app"),
  title: "IQ Test",
  description: "Test your IQ and get instant results",
  openGraph: {
    type: "website",
    url: "/",
    title: "IQ Test",
    description: "Test your IQ and get instant results",
    images: [
      {
        url: "https://iq-test-v1.vercel.app/image.png",
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
    images: ["https://iq-test-v1.vercel.app/image.png"]
  },
  other: {
    // Embed Farcaster frame metadata as a JSON string
    "fc:frame": "vNext",
    "fc:frame:metadata": JSON.stringify(frameMetadata),
    "fc:frame:image": "https://iq-test-v1.vercel.app/image.png",
    "fc:frame:button:1": "Start IQ Test",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": "https://iq-test-v1.vercel.app/"
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
