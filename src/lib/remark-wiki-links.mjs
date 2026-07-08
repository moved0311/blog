import path from "node:path";

const contentsDirectory = path.join(process.cwd(), "contents");
const wikiLinkPattern = /\[\[([^[\]]+)\]\]/g;

const slugifyHeading = (value) => {
  return value
    .trim()
    .toLowerCase()
    .replace(/[`*_~[\]{}()<>]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const stripMarkdownExtension = (value) => {
  return value.replace(/\.mdx?$/, "").replace(/\/index$/, "");
};

const getSourcePath = (filePath) => {
  const relativePath = path
    .relative(contentsDirectory, filePath)
    .replaceAll(path.sep, "/");

  return stripMarkdownExtension(relativePath);
};

const getSourceDirectory = (sourcePath) => {
  return sourcePath.split("/").slice(0, -1).join("/");
};

const toUrlPath = (sourcePath, target) => {
  const [rawPath, rawHash] = target.split("#");
  const targetPath = stripMarkdownExtension(rawPath.trim());
  const sourceDirectory = getSourceDirectory(sourcePath);
  const routePath = !targetPath
    ? sourcePath
    : targetPath.startsWith("/")
    ? targetPath
    : path.posix.normalize(path.posix.join(sourceDirectory, targetPath));
  const hash = rawHash ? `#${slugifyHeading(rawHash)}` : "";

  return `/${routePath}${hash}`;
};

const splitWikiLinks = (value, sourcePath) => {
  const nodes = [];
  let lastIndex = 0;

  for (const match of value.matchAll(wikiLinkPattern)) {
    const matchIndex = match.index ?? 0;
    const [rawWikiLink, rawTarget] = match;
    const [target, label] = rawTarget.split("|");

    if (matchIndex > lastIndex) {
      nodes.push({ type: "text", value: value.slice(lastIndex, matchIndex) });
    }

    nodes.push({
      type: "link",
      url: toUrlPath(sourcePath, target),
      children: [{ type: "text", value: (label ?? target).trim() }],
    });

    lastIndex = matchIndex + rawWikiLink.length;
  }

  if (lastIndex < value.length) {
    nodes.push({ type: "text", value: value.slice(lastIndex) });
  }

  return nodes;
};

const transformNode = (node, sourcePath) => {
  if (!node || !Array.isArray(node.children)) return;
  if (["link", "linkReference"].includes(node.type)) return;

  node.children = node.children.flatMap((child) => {
    if (child.type === "text" && wikiLinkPattern.test(child.value)) {
      wikiLinkPattern.lastIndex = 0;
      return splitWikiLinks(child.value, sourcePath);
    }

    transformNode(child, sourcePath);
    return child;
  });
};

export default function remarkWikiLinks() {
  return (tree, file) => {
    const sourcePath = getSourcePath(file.path);

    transformNode(tree, sourcePath);
  };
}
