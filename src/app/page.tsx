import type { Metadata } from "next";
import { Posts } from "@/features/post/components/posts";
import { Post } from "@/features/post/types/post";
import { TwoColumn } from "@/components/layouts/two-column";
import { findPosts } from "@/features/post/api";
import { load } from "@/lib/config";
import { parseByURL } from "@/lib/parser/rss";

export const metadata: Metadata = {
  title: "Posts",
  openGraph: {
    type: "website",
  },
};

const getPosts = async (): Promise<Post[]> => {
  const config = load();
  const qiitaFeed = await parseByURL(config.QIITA_URL);
  const zennFeed = await parseByURL(config.ZENN_URL);

  const postsFromFeed: Post[] = [...qiitaFeed.items, ...zennFeed.items].map(
    (v) => ({
      id: v.title || "",
      type: "external",
      title: v.title || "",
      content: v.content || "",
      link: v.link || "",
      createdAt: v.isoDate || "",
      updatedAt: v.isoDate || "",
    }),
  );

  const postsFromNotion = await findPosts();

  const posts = [...postsFromFeed, ...postsFromNotion].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return posts;
};

export default async function Page() {
  const posts = await getPosts();

  return (
    <TwoColumn>
      <Posts posts={posts} />
    </TwoColumn>
  );
}
