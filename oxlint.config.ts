import next from "@mrskiro/oxlint-config/next";
import { defineConfig } from "oxlint";

export default defineConfig({
  ...next,
  rules: {
    ...next.rules,
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
