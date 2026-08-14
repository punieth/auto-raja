import type { Metadata, Viewport } from "next";
import { Bebas_Neue, DM_Sans, Noto_Sans_Kannada } from "next/font/google";
import { brand } from "@/lib/brand";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

/** Display face for the Namma Meter wordmark */
const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const notoKannada = Noto_Sans_Kannada({
  subsets: ["kannada"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-kannada",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${brand.name} | Bangalore Auto Radio`,
  description: `${brand.subtitle} ${brand.pitch}`,
  openGraph: {
    title: `${brand.name} | Bangalore Auto Radio`,
    description: brand.pitch,
    images: ["/auto-raja-sunny-day.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} | ${brand.subtitle}`,
    description: brand.pitch,
    images: ["/auto-raja-sunny-day.png"],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://www.google.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
        <link rel="dns-prefetch" href="https://googlevideo.com" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
        <link rel="preload" href="https://www.youtube.com/iframe_api" as="script" />
      </head>
      <body
        className={`${dmSans.variable} ${bebasNeue.variable} ${notoKannada.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
