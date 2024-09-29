import { defineDocumentType, makeSource } from 'contentlayer/source-files'

import rehypePrism from 'rehype-prism-plus'
import rehypeCodeTitles from 'rehype-code-titles'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.mdx`,
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: false },
    date: { type: 'date', required: true },
    tags: { type: 'list', required: false, of: { type: 'string' } },
    lastUpdate: { type: 'date', required: false },
    draft: { type: 'boolean', required: false },
    type: { type: 'string', required: false },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (post) => `/${post._raw.flattenedPath}`,
    },
  },
}))

export default makeSource({
  contentDirPath: 'contents',
  documentTypes: [Post],
  mdx: {
    rehypePlugins: [rehypeCodeTitles, [rehypeKatex, { strict: false }], [rehypePrism, { ignoreMissing: true }]],
    remarkPlugins: [remarkGfm, remarkMath],
  },
})
