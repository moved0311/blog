const htmlOpenPattern = /^<([a-z][\w-]*)\s*([^>]*)>$/i;
const attributePattern = /([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;

const toMdxAttributeName = (name) => {
  return name === "class" ? "className" : name;
};

const parseAttributes = (value) => {
  return Array.from(value.matchAll(attributePattern)).map((match) => ({
    type: "mdxJsxAttribute",
    name: toMdxAttributeName(match[1]),
    value: match[2] ?? match[3] ?? "",
  }));
};

const transformChildren = (children) => {
  const nextChildren = [];

  for (let index = 0; index < children.length; index += 1) {
    const child = children[index];
    const openMatch =
      child.type === "html" ? child.value.match(htmlOpenPattern) : null;
    const tagName = openMatch?.[1].toLowerCase();

    if (openMatch && tagName === "span") {
      const closePattern = new RegExp(`^</${tagName}>$`, "i");
      const closeIndex = children.findIndex(
        (candidate, candidateIndex) =>
          candidateIndex > index &&
          candidate.type === "html" &&
          closePattern.test(candidate.value.trim()),
      );

      if (closeIndex !== -1) {
        nextChildren.push({
          type: "mdxJsxTextElement",
          name: "span",
          attributes: parseAttributes(openMatch[2]),
          children: children
            .slice(index + 1, closeIndex)
            .map((spanChild) => transformNode(spanChild)),
        });
        index = closeIndex;
        continue;
      }
    }

    nextChildren.push(transformNode(child));
  }

  return nextChildren;
};

const transformNode = (node) => {
  if (!node || !Array.isArray(node.children)) return node;

  return {
    ...node,
    children: transformChildren(node.children),
  };
};

export default function remarkHtmlSpans() {
  return (tree) => {
    tree.children = transformChildren(tree.children);
  };
}
