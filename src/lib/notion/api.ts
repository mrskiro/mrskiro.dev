import * as Notion from "@notionhq/client"
import {
  PageObjectResponse,
  BlockObjectResponse,
  QueryDatabaseParameters,
} from "@notionhq/client/build/src/api-endpoints"
import { load } from "@/lib/config"

const { NOTION_TOKEN } = load()
// TODO: envに移動
const DATABASE_ID = "1afad33e822d4042b703999915c8bc24"

const client = new Notion.Client({
  auth: NOTION_TOKEN,
})

export const findPostsWherePublished = async (): Promise<
  PageObjectResponse[]
> => {
  const filters: QueryDatabaseParameters["filter"] = {
    or: [
      {
        type: "checkbox",
        property: "Published",
        checkbox: {
          equals: true,
        },
      },
    ],
  }
  if (process.env.NEXT_PUBLIC_STAGE === "local") {
    filters.or.push({
      type: "checkbox",
      property: "Preview",
      checkbox: {
        equals: true,
      },
    })
  }
  const res = await client.databases.query({
    database_id: DATABASE_ID,
    filter: filters,
    sorts: [
      {
        property: "CreatedAt",
        direction: "ascending",
      },
    ],
  })
  if (!res.results.every(isPageObjectResponse)) {
    throw new Error("res has PartialPageObjectResponse")
  }
  return res.results
}

export const findMetaBySlug = async (
  slug: string
): Promise<PageObjectResponse> => {
  const { id } = await findPageBySlug(slug)
  const res = await findMetaByPageId(id)
  return res
}

const findPageBySlug = async (slug: string): Promise<PageObjectResponse> => {
  const db = await client.databases.query({
    database_id: DATABASE_ID,
    filter: {
      and: [
        {
          type: "rich_text",
          property: "Slug",
          rich_text: {
            equals: slug,
          },
        },
      ],
    },
  })
  const [target] = db.results
  if (!target) {
    throw new Error(`not match slug: ${slug}`)
  }
  if (!isPageObjectResponse(target)) {
    throw new Error(`findPageBySlug: res is PartialPageObjectResponse`)
  }
  return target
}

export const findMetaByPageId = async (
  pageId: string
): Promise<PageObjectResponse> => {
  const res = await client.pages.retrieve({
    page_id: pageId,
  })
  if (!isPageObjectResponse(res)) {
    throw new Error("res is PartialPageObjectResponse")
  }
  return res
}

export type BlockObject = BlockObjectResponse &
  (
    | {
        has_children: true
        children: BlockObject[]
      }
    | {
        has_children: false
        children?: never
      }
  )

export const findPageBlocksByPageId = async (
  pageId: string,
  startCursor?: string
): Promise<BlockObject[]> => {
  const results: BlockObject[] = []

  const res = await client.blocks.children.list({
    block_id: pageId,
    start_cursor: startCursor,
  })
  if (!res.results.every(isBlockObjectResponse)) {
    throw new Error("findPageBlocksByPageId: res has PartialPageObjectResponse")
  }

  for (const block of res.results) {
    if (block.has_children) {
      const children = await findNestedBlocks(block.id)
      results.push({ ...block, has_children: true, children })
      continue
    }
    results.push({ ...block, has_children: false })
  }

  if (res.next_cursor) {
    const more = await findPageBlocksByPageId(pageId, res.next_cursor)
    results.push(...more)
  }

  return results
}

const findNestedBlocks = async (blockId: string) => {
  const results: BlockObject[] = []
  const res = await client.blocks.children.list({
    block_id: blockId,
  })

  if (!res.results.every(isBlockObjectResponse)) {
    throw new Error("findPageBlocksByPageId: res has PartialPageObjectResponse")
  }
  for (const block of res.results) {
    if (block.has_children) {
      const children = await findNestedBlocks(block.id)
      results.push({ ...block, has_children: true, children })
      continue
    }
    results.push({ ...block, has_children: false })
  }

  return results
}
const isPageObjectResponse = (
  res: Record<PropertyKey, unknown>
): res is PageObjectResponse => {
  return Object.hasOwn(res, "properties")
}

const isBlockObjectResponse = (
  res: Record<PropertyKey, unknown>
): res is BlockObjectResponse => Object.hasOwn(res, "type")
