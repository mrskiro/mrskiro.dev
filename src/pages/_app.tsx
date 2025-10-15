import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { ErrorBoundary } from "@/components/error-boundary";
import { ThemeProvider } from "@/features/theme/context";
import { TwoColumn } from "@/layouts/two-column";
import { isPrd } from "@/lib/environment";
import { GoogleAnalytics, usePegeView } from "@/lib/log";
import type { AppProps } from "next/app";
import "../styles/globals.css";

const MyApp = (
  props: AppProps<{
    meta?: {
      title?: string;
      ogType?: "website" | "article";
    };
  }>,
) => {
  usePegeView();

  const { meta } = props.pageProps;

  const router = useRouter();
  const url = `https://mrskiro.dev${router.asPath}`;
  return (
    <>
      <Head>
        <link
          rel="icon"
          href="data:image/svg+xml,&lt;svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22&gt;&lt;text x=%2250%%22 y=%2250%%22 style=%22dominant-baseline:central;text-anchor:middle;font-size:90px;%22&gt;🟣&lt;/text&gt;&lt;/svg&gt;"
        />
        <link rel="canonical" href={url} />

        <title>
          {meta?.title ? `${meta.title} | mrskiro.dev` : "mrskiro.dev"}
        </title>
        <meta name="twitter:site" content="@mrskiro_" />
        <meta name="twitter:card" content="summary" />
        <meta property="og:site_name" content="mrskiro.dev" />
        <meta
          property="og:image"
          content="https://www.mrskiro.dev/assets/mrskiro.png"
        />
        <meta property="og:title" content={meta?.title ?? "mrskiro.dev"} />
        <meta property="og:type" content={meta?.ogType ?? "website"} />
        <meta property="og:url" content={url} />
      </Head>
      {isPrd() && <GoogleAnalytics />}
      <ThemeProvider>
        {/* TODO: ThemeProvider内でのerrorを感知できないのでどうするか考える */}
        <ErrorBoundary
          fallback={() => (
            <TwoColumn>エラーが発生しました。リロードしてください。</TwoColumn>
          )}
        >
          <props.Component {...props.pageProps} />
        </ErrorBoundary>
      </ThemeProvider>
    </>
  );
};

export default MyApp;
