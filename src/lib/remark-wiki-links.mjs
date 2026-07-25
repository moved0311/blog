import path from "node:path";

const contentsDirectory = path.join(process.cwd(), "contents");
const wikiLinkPattern = /(!?)\[\[([^[\]]+)\]\]/g;
const imageExtensionPattern = /\.(avif|gif|jpe?g|png|svg|webp)$/i;

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

const getContentDirectory = (filePath) => {
  return path
    .dirname(path.relative(contentsDirectory, filePath))
    .replaceAll(path.sep, "/");
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

const toPublicImagePath = (contentDirectory, target) => {
  const [rawPath] = target.split("#");
  const targetPath = rawPath.trim();
  const imagePath = targetPath.startsWith("/")
    ? targetPath
    : path.posix.normalize(path.posix.join(contentDirectory, targetPath));

  return `/images/${imagePath}`;
};

const splitWikiLinks = (value, sourcePath, contentDirectory) => {
  const nodes = [];
  let lastIndex = 0;

  for (const match of value.matchAll(wikiLinkPattern)) {
    const matchIndex = match.index ?? 0;
    const [rawWikiLink, embedMarker, rawTarget] = match;
    const [target, label] = rawTarget.split("|");
    const trimmedTarget = target.trim();
    const trimmedLabel = label?.trim();

    if (matchIndex > lastIndex) {
      nodes.push({ type: "text", value: value.slice(lastIndex, matchIndex) });
    }

    if (embedMarker === "!" && imageExtensionPattern.test(trimmedTarget)) {
      nodes.push({
        type: "image",
        url: toPublicImagePath(contentDirectory, trimmedTarget),
        alt: trimmedLabel ?? path.posix.basename(trimmedTarget),
      });
    } else {
      nodes.push({
        type: "link",
        url: toUrlPath(sourcePath, trimmedTarget),
        children: [{ type: "text", value: trimmedLabel ?? trimmedTarget }],
      });
    }

    lastIndex = matchIndex + rawWikiLink.length;
  }

  if (lastIndex < value.length) {
    nodes.push({ type: "text", value: value.slice(lastIndex) });
  }

  return nodes;
};

const transformNode = (node, sourcePath, contentDirectory) => {
  if (!node || !Array.isArray(node.children)) return;
  if (["link", "linkReference"].includes(node.type)) return;

  node.children = node.children.flatMap((child) => {
    if (child.type === "text" && wikiLinkPattern.test(child.value)) {
      wikiLinkPattern.lastIndex = 0;
      return splitWikiLinks(child.value, sourcePath, contentDirectory);
    }

    transformNode(child, sourcePath, contentDirectory);
    return child;
  });
};

export default function remarkWikiLinks() {
  return (tree, file) => {
    const sourcePath = getSourcePath(file.path);
    const contentDirectory = getContentDirectory(file.path);

    transformNode(tree, sourcePath, contentDirectory);
  };
}
