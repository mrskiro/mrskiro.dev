import { PostDetail } from "@/features/post/components/post-detail";
import { ThreeColumn } from "@/components/layouts/three-column";
import { findPostDetailById } from "@/features/post/api";
import { env } from "@/env";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  openGraph: {
    type: "article",
  },
};

export default async function Page() {
  const { ABOUT_PAGE_ID } = env;
  const aboutPageDetail = await findPostDetailById(ABOUT_PAGE_ID);

  const headings = aboutPageDetail.blocks.filter((v) => {
    switch (v.type) {
      case "heading1":
      case "heading2":
      case "heading3":
        return true;
      default:
        return false;
    }
  });

  return (
    <ThreeColumn headings={headings}>
      <PostDetail postDetail={aboutPageDetail} />
    </ThreeColumn>
  );
}
