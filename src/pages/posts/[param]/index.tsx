import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import { useRouter } from "next/router"
import { PostDetailPage } from "@/components/pages/posts/[param]"
import { findPosts as findNotionPosts, findPostDetailBySlug as findNotionPostDetailBySlug } from "@/features/post/api"
import { findPosts as findMDXPosts, findPostDetailBySlug as findMDXPostDetailBySlug } from "@/features/post/api/mdx-api"
import { serializeMDXContent } from "@/features/post/components/post-detail/mdx-post-detail"
import * as PostTypes from "@/features/post/types"
import { toPublic } from "@/lib/image"

export const getStaticPaths: GetStaticPaths = async () => {
  // Try to get posts from both MDX and Notion
  let posts: PostTypes.Post[] = []
  
  try {
    const mdxPosts = await findMDXPosts()
    posts = [...posts, ...mdxPosts]
  } catch (error) {
    console.log("No MDX posts found:", error)
  }
  
  try {
    const notionPosts = await findNotionPosts()
    posts = [...posts, ...notionPosts]
  } catch (error) {
    console.log("No Notion posts found:", error)
  }
  
  const paths = posts.map((v) => v.link)
  return {
    paths,
    fallback: true,
  }
}

type Props = {
  postDetail: PostTypes.PostDetail
  mdxSource?: any
}

export const getStaticProps: GetStaticProps<Props, { param: string }> = async (
  ctx
) => {
  const slug = ctx.params?.param
  if (!slug) {
    throw new Error("not exist slug")
  }

  let postDetail: PostTypes.PostDetail
  let mdxSource: any = null

  // Try to find post in MDX first, then fallback to Notion
  try {
    postDetail = await findMDXPostDetailBySlug(slug)
    if (postDetail.mdxContent) {
      mdxSource = await serializeMDXContent(postDetail.mdxContent)
    }
  } catch (error) {
    console.log("Post not found in MDX, trying Notion:", error)
    try {
      postDetail = await findNotionPostDetailBySlug(slug)
      
      // Handle Notion image saving
      const shouldSaveImages = postDetail.blocks.reduce<
        { id: string; url: string }[]
      >((p, c) => {
        if (c.type !== "image") {
          return p
        }
        return [...p, { id: c.id, url: c.url }]
      }, [])

      toPublic(shouldSaveImages)
    } catch (notionError) {
      throw new Error(`Post not found: ${slug}`)
    }
  }

  return {
    props: {
      postDetail,
      mdxSource,
      meta: {
        title: postDetail.title.plainText,
        ogType: "article",
      },
    },
  }
}

const Page: NextPage<Props> = (props) => {
  const router = useRouter()
  if (router.isFallback) {
    return <p>loading...</p>
  }

  return <PostDetailPage postDetail={props.postDetail} mdxSource={props.mdxSource} />
}

export default Page
