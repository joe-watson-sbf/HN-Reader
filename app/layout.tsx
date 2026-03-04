import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getBookmarkedIds } from "./lib/store";
import { BookmarkProvider } from "./components/BookmarkContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = "https://hn-reader-joe-watson.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "vinext Demo — HN Reader by Joe Watson DEV",
    template: "%s | vinext Demo",
  },
  description:
    "A real Hacker News reader built to stress-test vinext — the Vite-powered Next.js runtime. Demonstrates RSC streaming, recursive async components, server actions, dynamic routes, ISR, and proxy middleware. Built by Joe Watson DEV.",
  keywords: [
    "vinext",
    "vite",
    "next.js",
    "react server components",
    "RSC streaming",
    "hacker news",
    "demo",
    "Joe Watson DEV",
  ],
  authors: [
    { name: "Joe Watson DEV", url: "https://github.com/joe-watson-sbf" },
  ],
  creator: "Joe Watson DEV",
  publisher: "Joe Watson DEV",
  openGraph: {
    type: "website",
    url: BASE_URL,
    title: "vinext Demo — HN Reader by Joe Watson DEV",
    description:
      "A real Hacker News reader stress-testing vinext: RSC streaming, server actions, ISR, recursive async RSC, and proxy middleware. Same Next.js code, Vite runtime.",
    siteName: "vinext Demo",
  },
  twitter: {
    card: "summary_large_image",
    title: "vinext Demo — HN Reader by Joe Watson DEV",
    description:
      "Stress-testing vinext with a real HN reader: RSC streaming, server actions, ISR, recursive async components, and more.",
    creator: "@joe_watson_sbf",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ids = await getBookmarkedIds();
  return (
    <html lang="en" suppressHydrationWarning className='font-sans'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BookmarkProvider initialIds={[...ids]}>
          {children}
        </BookmarkProvider>
      </body>
    </html>
  );
}
