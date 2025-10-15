import { it, expect } from "vitest";
import { render } from "@/test/utils";
import { RootPage } from "./root";

it("renders correctly", async () => {
  const screen = render(
    <RootPage
      posts={[
        {
          id: "1",
          type: "external",
          title: "Qiitaの記事",
          link: "/posts/qiita-post",
          createdAt: "2023-06-24T12:02:00.000Z",
          updatedAt: "2023-06-24T12:02:00.000Z",
        },
        {
          id: "2",
          type: "internal",
          title: "notionの記事",
          link: "/posts/notion-post",
          createdAt: "2023-06-24T12:02:00.000Z",
          updatedAt: "2023-06-24T12:02:00.000Z",
        },
      ]}
    />,
  );

  await expect.element(screen.container).toBeInTheDocument();
});
