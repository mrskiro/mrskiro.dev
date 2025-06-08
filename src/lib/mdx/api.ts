import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export interface PostFrontmatter {
  title: string
  slug: string
  createdAt: string
  updatedAt: string
  published: boolean
  preview?: boolean
}

export interface MDXPost {
  frontmatter: PostFrontmatter
  content: string
  filePath: string
}

export const getAllMDXPosts = (): MDXPost[] => {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const filenames = fs.readdirSync(postsDirectory)
  const posts = filenames
    .filter(filename => filename.endsWith('.mdx'))
    .map(filename => {
      const filePath = path.join(postsDirectory, filename)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)
      
      return {
        frontmatter: data as PostFrontmatter,
        content,
        filePath: filename,
      }
    })
    .filter(post => {
      // Filter published posts, or preview posts in local development
      if (process.env.NEXT_PUBLIC_STAGE === 'local') {
        return post.frontmatter.published || post.frontmatter.preview
      }
      return post.frontmatter.published
    })
    .sort((a, b) => {
      // Sort by creation date, newest first
      return new Date(b.frontmatter.createdAt).getTime() - new Date(a.frontmatter.createdAt).getTime()
    })

  return posts
}

export const getMDXPostBySlug = (slug: string): MDXPost | null => {
  const posts = getAllMDXPosts()
  const post = posts.find(post => post.frontmatter.slug === slug)
  return post || null
}

export const getAllMDXSlugs = (): string[] => {
  const posts = getAllMDXPosts()
  return posts.map(post => post.frontmatter.slug)
}