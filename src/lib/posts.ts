import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const contentsDirectory = path.join(process.cwd(), "contents");
const publicContentDirectories = ["posts", "notes"].map((directory) =>
  path.join(contentsDirectory, directory),
);

export type Post = {
  title: string;
  description?: string;
  date: string;
  tags?: string[];
  lastUpdate?: string;
  draft?: boolean;
  category?: string;
  url: string;
  relativePath: string;
  _raw: {
    flattenedPath: string;
  };
};

const normalizeDate = (value: unknown): string => {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value);
};

const toPost = (filePath: string): Post => {
  const source = fs.readFileSync(filePath, "utf8");
  const { data } = matter(source);
  const relativePath = path
    .relative(contentsDirectory, filePath)
    .replaceAll(path.sep, "/");
  const flattenedPath = relativePath
    .replace(/\.mdx?$/, "")
    .replace(/\/index$/, "");

  return {
    title: String(data.title),
    description: data.description ? String(data.description) : undefined,
    date: normalizeDate(data.date),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : undefined,
    lastUpdate: data.lastUpdate ? normalizeDate(data.lastUpdate) : undefined,
    draft: data.draft === true,
    category: data.category ? String(data.category) : undefined,
    url: `/${flattenedPath}`,
    relativePath,
    _raw: {
      flattenedPath,
    },
  };
};

const isMarkdownFile = (fileName: string) => /\.mdx?$/.test(fileName);

const getMarkdownFiles = (directory: string): string[] => {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return getMarkdownFiles(entryPath);
    }

    return entry.isFile() && isMarkdownFile(entry.name) ? [entryPath] : [];
  });
};

export const getAllPosts = () => {
  return publicContentDirectories.flatMap((directory) =>
    getMarkdownFiles(directory).map(toPost),
  );
};

export const getPost = (flattenedPath: string) => {
  return getAllPosts().find((post) => post._raw.flattenedPath === flattenedPath);
};

export const importMdx = async (relativePath: string) => {
  return import(`../../contents/${relativePath}`);
};
