import { PostDetail } from "@/features/post/components/post-detail";
import { MDXPostDetail } from "@/features/post/components/post-detail/mdx-post-detail";
import { TableOfContents } from "@/features/post/components/table-of-contents";
import { PostDetail as PostDetailType } from "@/features/post/types";
import { ThreeColumn } from "@/layouts/three-column";
import { BmcButton } from "@/lib/bmc";

type Props = {
  postDetail: PostDetailType;
  mdxSource?: any;
};

export const PostDetailPage = (props: Props) => {
  const headings = props.postDetail.blocks.filter((v) => {
    switch (v.type) {
      case "heading1":
      case "heading2":
      case "heading3":
        return true;
      default:
        return false;
    }
  });

  const isUsingMDX = props.postDetail.mdxContent || props.mdxSource;

  return (
    <ThreeColumn renderRight={() => <TableOfContents headings={headings} />}>
      {isUsingMDX ? (
        <MDXPostDetail postDetail={props.postDetail} mdxSource={props.mdxSource} />
      ) : (
        <PostDetail postDetail={props.postDetail} />
      )}
      <div className="mt-12">
        <BmcButton />
      </div>
    </ThreeColumn>
  );
};
