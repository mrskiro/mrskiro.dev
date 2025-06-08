import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import { useMDXComponents } from '../../../../../mdx-components'
import * as Types from "@/features/post/types"
import { format } from "@/lib/date"
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

type Props = {
  postDetail: Types.PostDetail
  mdxSource?: any
}

export const MDXPostDetail = (props: Props) => {
  const components = useMDXComponents({})

  return (
    <article className="leading-7">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">
          {props.postDetail.title.plainText}
        </h1>
        <div className="flex justify-between items-center">
          <div />
          <div>
            <p className="text-right text-xs">{`${format(
              props.postDetail.createdAt
            )}`}</p>
            {format(props.postDetail.updatedAt) !==
              format(props.postDetail.createdAt) && (
              <p className="text-right text-xs">{`最終更新：${format(
                props.postDetail.updatedAt
              )}`}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Render MDX content if available */}
      {props.mdxSource && (
        <div className="prose prose-lg max-w-none">
          <MDXRemote {...props.mdxSource} components={components} />
        </div>
      )}
    </article>
  )
}

export const serializeMDXContent = async (content: string) => {
  return await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeHighlight],
    },
  })
}