import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints"
import {
  findPostsWherePublished,
  findMetaByPageId,
  findMetaBySlug,
  findPageBlocksByPageId,
  BlockObject,
} from "@/lib/notion/api"
import { Block, BlockBase, RichText } from "../types"
import { Post, PostDetail } from "../types/post"

export const findPosts = async (): Promise<Post[]> => {
  const res = await findPostsWherePublished()

  const posts: Post[] = res.map((v) => {
    const nameProperty = v.properties["Name"]
    if (nameProperty?.type !== "title") {
      throw new Error("not exist name property")
    }
    const slugProperty = v.properties["Slug"]
    if (slugProperty?.type !== "rich_text") {
      throw new Error("not exist slug property")
    }
    const [slug] = slugProperty.rich_text
    if (!slug) {
      throw new Error("not exist slug rich text property")
    }
    const createdAt = v.properties["CreatedAt"]
    if (createdAt?.type !== "date") {
      throw new Error("not exist createdAt property")
    }
    return {
      id: v.id,
      type: "internal",
      title: nameProperty.title[0]?.plain_text || "",
      link: `/posts/${slug.plain_text}`,
      createdAt: createdAt.date?.start ?? v.created_time,
      updatedAt: v.last_edited_time,
    }
  })
  return posts
}

export const findPostDetailBySlug = async (
  slug: string
): Promise<PostDetail> => {
  const meta = await findMetaBySlug(slug)
  const [blocks] = await Promise.all([findPageBlocksByPageId(meta.id)])
  const nameProperty = meta.properties["Name"] || meta.properties["title"]

  if (!nameProperty) {
    throw new Error("not exist post title")
  }
  if (nameProperty.type !== "title") {
    throw new Error(`not title type: ${nameProperty.type}`)
  }
  const [title] = nameProperty.title
  if (!title) {
    throw new Error(`not exist title: ${nameProperty.title}`)
  }

  const createdAtProperty = meta.properties["CreatedAt"]
  if (!createdAtProperty || createdAtProperty?.type !== "date") {
    throw new Error("not exist createdAt")
  }

  return {
    title: richTextFrom(title),
    blocks: blocksFrom(blocks),
    createdAt: createdAtProperty.date?.start ?? meta.created_time,
    updatedAt: meta.last_edited_time,
  }
}

export const findPostDetailById = async (
  pageId: string
): Promise<PostDetail> => {
  const [meta, blocks] = await Promise.all([
    findMetaByPageId(pageId),
    findPageBlocksByPageId(pageId),
  ])

  const nameProperty = meta.properties["Name"] || meta.properties["title"]

  if (!nameProperty) {
    throw new Error("not exist post title")
  }
  if (nameProperty.type !== "title") {
    throw new Error(`not title type: ${nameProperty.type}`)
  }
  const [title] = nameProperty.title
  if (!title) {
    throw new Error(`not exist title: ${nameProperty.title}`)
  }
  return {
    title: richTextFrom(title),
    blocks: blocksFrom(blocks),
    createdAt: meta.created_time,
    updatedAt: meta.last_edited_time,
  }
}

const blocksFrom = (blocks: BlockObject[]): Block[] => {
  const results: Block[] = []

  blocks.forEach((block) => {
    const children = []
    if (block.has_children) {
      children.push(...blocksFrom(block.children))
    }
    const base: BlockBase = {
      id: block.id,
      parentId: block.parent.type === "block_id" ? block.parent.block_id : null,
      hasChildren: block.has_children,
      children,
    }

    switch (block.type) {
      case "heading_1": {
        results.push({
          ...base,
          type: "heading1",
          color: block.heading_1.color,
          richText: richTextsFrom(block.heading_1.rich_text),
        })
        return
      }
      case "heading_2": {
        results.push({
          ...base,
          type: "heading2",
          color: block.heading_2.color,
          richText: richTextsFrom(block.heading_2.rich_text),
        })
        return
      }
      case "heading_3": {
        results.push({
          ...base,
          type: "heading3",
          color: block.heading_3.color,
          richText: richTextsFrom(block.heading_3.rich_text),
        })
        return
      }
      case "paragraph": {
        results.push({
          ...base,
          type: "paragraph",
          color: block.paragraph.color,
          richText: richTextsFrom(block.paragraph.rich_text),
        })
        return
      }
      case "bulleted_list_item": {
        results.push({
          ...base,
          type: "bulletedListItem",
          color: block.bulleted_list_item.color,
          richText: richTextsFrom(block.bulleted_list_item.rich_text),
        })
        return
      }
      case "numbered_list_item": {
        results.push({
          ...base,
          type: "numberedListItem",
          color: block.numbered_list_item.color,
          richText: richTextsFrom(block.numbered_list_item.rich_text),
        })
        return
      }
      case "code":
        results.push({
          ...base,
          type: "code",
          language: block.code.language,
          richText: richTextsFrom(block.code.rich_text),
        })
        return
      case "image":
        {
          if (block.image.type === "file") {
            results.push({
              ...base,
              type: "image",
              url: block.image.file.url,
              // TODO
              richText: [],
              caption: richTextsFrom(block.image.caption),
            })
          }
        }
        return
      default:
        return
    }
  })
  return results
}

const richTextsFrom = (texts: RichTextItemResponse[]): RichText[] => {
  return texts.map(richTextFrom)
}

const richTextFrom = (richText: RichTextItemResponse): RichText => {
  switch (richText.type) {
    case "text": {
      return {
        type: "text",
        plainText: richText.plain_text,
        text: {
          ...richText.text,
        },
        href: richText.href,
        annotations: richText.annotations,
      }
    }
    case "mention":
    case "equation":
    default:
      throw new Error(`unsupportted rich text type: ${richText.type}`)
  }
}
