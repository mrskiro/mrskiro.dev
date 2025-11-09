import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets-zod";
import { z } from "zod";

export const env = createEnv({
  /**
   * サーバーサイド環境変数
   * クライアントからアクセスするとエラー
   */
  server: {
    NOTION_TOKEN: z.string().min(1),
    QIITA_URL: z.url(),
    ZENN_URL: z.url(),
    ABOUT_PAGE_ID: z.string().min(1),
    SITE_URL: z.url(),
    SENTRY_ORG: z.string().optional(),
    SENTRY_PROJECT: z.string().optional(),
    SENTRY_AUTH_TOKEN: z.string().optional(),
  },

  /**
   * クライアントサイド環境変数
   * NEXT_PUBLIC_ プレフィックスが必須
   */
  client: {
    NEXT_PUBLIC_SENTRY_DSN: z.url().optional(),
    NEXT_PUBLIC_STAGE: z.string().optional(),
  },

  extends: [vercel()],
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_STAGE: process.env.NEXT_PUBLIC_STAGE,
  },
});
