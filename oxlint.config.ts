import next from "@mrskiro/oxlint-config/next";
import { defineConfig } from "oxlint";

export default defineConfig({
  ...next,
  rules: {
    ...next.rules,
    // feed の og 画像は任意ドメインの外部画像で images.remotePatterns に列挙できず、
    // MDX の画像も ![alt](src) から width/height を取れないため next/image に載せられない。
    "nextjs/no-img-element": "off",
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "react",
            importNames: ["useEffect"],
            message:
              "useEffect is banned. See: https://ja.react.dev/learn/you-might-not-need-an-effect",
          },
          {
            name: "react",
            importNames: ["useCallback", "useMemo"],
            message: "useCallback/useMemo are banned. React Compiler handles memoization.",
          },
        ],
      },
    ],
  },
});
