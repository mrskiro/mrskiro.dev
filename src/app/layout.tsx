import { ReactNode } from "react";
import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { ThemeProvider } from "@/features/theme/context";
// import { GoogleAnalytics } from "@/lib/log";
// import { isPrd } from "@/lib/environment";
import "@/styles/globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: {
    default: "mrskiro.dev",
    template: "%s | mrskiro.dev",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text x=%2250%%22 y=%2250%%22 style=%22dominant-baseline:central;text-anchor:middle;font-size:90px;%22>🟣</text></svg>",
  },
  openGraph: {
    siteName: "mrskiro.dev",
    images: [
      {
        url: "https://www.mrskiro.dev/assets/mrskiro.png",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    site: "@mrskiro_",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja" className={notoSansJP.variable}>
      <body>
        {/* TODO: GoogleAnalyticsをApp Router対応させる */}
        {/* {isPrd() && <GoogleAnalytics />} */}
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
