const isDiffLine = (node) =>
  node?.type === "element" &&
  node.tagName === "span" &&
  Array.isArray(node.properties?.className) &&
  node.properties.className.includes("code-line") &&
  (node.properties.className.includes("inserted") ||
    node.properties.className.includes("deleted"));

const wrapMarker = (children, marker) => {
  for (const child of children) {
    if (child?.type === "text" && child.value) {
      if (child.value.startsWith(marker)) {
        child.value = child.value.slice(marker.length);
        return true;
      }

      continue;
    }

    if (child?.type === "element" && wrapMarker(child.children, marker)) {
      return true;
    }
  }

  return false;
};

const visit = (node) => {
  if (!node || !Array.isArray(node.children)) return;

  if (isDiffLine(node)) {
    wrapMarker(
      node.children,
      node.properties.className.includes("inserted") ? "+" : "-",
    );
  }

  node.children.forEach(visit);
};

export default function rehypeDiffMarkers() {
  return (tree) => visit(tree);
}
