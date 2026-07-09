const htmlBreakPattern = /<br\s*\/?>/gi;

const splitHtmlBreaks = (value) => {
  const nodes = [];
  let lastIndex = 0;

  for (const match of value.matchAll(htmlBreakPattern)) {
    const matchIndex = match.index ?? 0;

    if (matchIndex > lastIndex) {
      nodes.push({ type: "text", value: value.slice(lastIndex, matchIndex) });
    }

    nodes.push({ type: "break" });
    lastIndex = matchIndex + match[0].length;
  }

  if (lastIndex < value.length) {
    nodes.push({ type: "text", value: value.slice(lastIndex) });
  }

  return nodes;
};

const transformNode = (node) => {
  if (!node || !Array.isArray(node.children)) return;

  node.children = node.children.flatMap((child) => {
    if (child.type === "text" && htmlBreakPattern.test(child.value)) {
      htmlBreakPattern.lastIndex = 0;
      return splitHtmlBreaks(child.value);
    }

    if (child.type === "html" && htmlBreakPattern.test(child.value.trim())) {
      htmlBreakPattern.lastIndex = 0;
      return { type: "break" };
    }

    transformNode(child);
    return child;
  });
};

export default function remarkHtmlBreaks() {
  return (tree) => {
    transformNode(tree);
  };
}
