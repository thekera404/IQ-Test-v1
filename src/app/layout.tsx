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

// export const metadata: Metadata = {
//     metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://iq-test-v2.vercel.app"),
//     title: {
//         default: "IQ Test",
//         template: "%s | IQ Test",
//     },
//     description: "Test your IQ",
//     openGraph: {
//         type: "website",
//         url: "/",
//         title: "IQ Test",
//         description: "Test your IQ",
//         images: [
//             {
//                 url: "/og",
//                 width: 1200,
//                 height: 630,
//                 alt: "IQ Test",
//             },
//         ],
//     },
//     twitter: {
//         card: "summary_large_image",
//         title: "IQ Test",
//         description: "Test your IQ",
//         images: ["/og"],
//     },
//     other: {
//         "fc:frame": "vNext",
//         "fc:frame:image": "/og",
//         "fc:frame:button:1": "Start IQ Test",
//         "fc:frame:button:1:action": "link",
//         "fc:frame:button:1:target": "/",
//     },
// };


export const metadata = {
  title: "IQ Test",
  description: "A timed 10-question IQ quiz",
  openGraph: {
    title: "IQ Test",
    description: "Test your cognitive abilities",
    url: "https://iq-test-v2.vercel.app",
    images: [
      {
        url: "https://iq-test-v2.vercel.app/og",
        width: 1200,
        height: 630,
        alt: "IQ Test"
      }
    ],
    type: "website"
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
