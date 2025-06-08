import { getAllMDXPosts, getMDXPostBySlug } from "@/lib/mdx/api"
import { Post, PostDetail } from "../types/post"
import { RichText } from "../types"

export const findPosts = async (): Promise<Post[]> => {
  const mdxPosts = getAllMDXPosts()

  const posts: Post[] = mdxPosts.map((mdxPost) => ({
    id: mdxPost.frontmatter.slug,
    type: "internal" as const,
    title: mdxPost.frontmatter.title,
    link: `/posts/${mdxPost.frontmatter.slug}`,
    createdAt: mdxPost.frontmatter.createdAt,
    updatedAt: mdxPost.frontmatter.updatedAt,
  }))

  return posts
}

export const findPostDetailBySlug = async (
  slug: string
): Promise<PostDetail> => {
  const mdxPost = getMDXPostBySlug(slug)
  
  if (!mdxPost) {
    throw new Error(`Post not found: ${slug}`)
  }

  // Create a simple RichText object for the title
  const titleRichText: RichText = {
    type: "text",
    plainText: mdxPost.frontmatter.title,
    text: {
      content: mdxPost.frontmatter.title,
      link: null,
    },
    href: null,
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: "default",
    },
  }

  // For MDX, we'll render the content directly in the component
  // So we create an empty blocks array and pass the content separately
  return {
    title: titleRichText,
    blocks: [], // MDX content will be rendered directly
    createdAt: mdxPost.frontmatter.createdAt,
    updatedAt: mdxPost.frontmatter.updatedAt,
    // Add MDX content for rendering
    mdxContent: mdxPost.content,
  }
}

export const findPostDetailById = async (
  pageId: string
): Promise<PostDetail> => {
  // For MDX, we'll use slug as ID
  return findPostDetailBySlug(pageId)
}