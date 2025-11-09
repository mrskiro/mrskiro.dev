import { PostDetail } from "@/features/post/components/post-detail";
import { ThreeColumn } from "@/components/layouts/three-column";
import { BmcButton } from "@/components/bmc-button";
import { findPostDetailBySlug, findPosts } from "@/features/post/api";
import { toPublic } from "@/lib/image/to-public";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ param: string }>;
};

export async function generateStaticParams() {
  const posts = await findPosts();
  return posts.map((post) => ({
    param: post.link.replace("/posts/", ""),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { param } = await params;
  const postDetail = await findPostDetailBySlug(param);

  return {
    title: postDetail.title.plainText,
    openGraph: {
      type: "article",
    },
  };
}

export default async function Page({ params }: Props) {
  const { param } = await params;
  const postDetail = await findPostDetailBySlug(param);

  const shouldSaveImages = postDetail.blocks.reduce<
    { id: string; url: string }[]
  >((p, c) => {
    if (c.type !== "image") {
      return p;
    }
    return [...p, { id: c.id, url: c.url }];
  }, []);

  toPublic(shouldSaveImages);

  const headings = postDetail.blocks.filter((v) => {
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
      <PostDetail postDetail={postDetail} />
      <div className="mt-12">
        <BmcButton />
      </div>
    </ThreeColumn>
  );
}
