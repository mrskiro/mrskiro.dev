import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "mrskiro",
    template: "%s - mrskiro",
  },
  description: "Software Engineer from Japan. Indie hacker building things around UI/UX and AI.",
  metadataBase: new URL("https://mrskiro.dev"),
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "mrskiro",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@mrskiro_",
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="mx-auto max-w-xl px-4 py-12">{children}</body>
    </html>
  );
}
