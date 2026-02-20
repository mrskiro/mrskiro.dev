import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "mrskiro",
    template: "%s - mrskiro",
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
