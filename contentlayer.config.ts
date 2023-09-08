import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypePrism from "rehype-prism-plus";
import rehypeCodeTitles from "rehype-code-titles";

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: false },
    date: { type: "date", required: true },
    tags: { type: "list", required: false, of: { type: "string" } },
    lastUpdate: { type: "date", required: false },
    draft: { type: "boolean", required: false },
  },
  computedFields: {
    url: { type: "string", resolve: (post) => `/posts/${post._raw.flattenedPath}` },
  },
}));

export default makeSource({
  contentDirPath: "posts",
  documentTypes: [Post],
  mdx: { rehypePlugins: [rehypeCodeTitles, [rehypePrism, { ignoreMissing: true }]] },
});
