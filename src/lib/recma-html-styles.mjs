const toCamelCase = (value) => {
  return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
};

const isIdentifierName = (value) => /^[$A-Z_a-z][$\w]*$/.test(value);

const createStyleProperty = (property, value) => {
  const key = toCamelCase(property.trim());

  return {
    type: "Property",
    method: false,
    shorthand: false,
    computed: false,
    kind: "init",
    key: isIdentifierName(key)
      ? { type: "Identifier", name: key }
      : { type: "Literal", value: key, raw: JSON.stringify(key) },
    value: {
      type: "Literal",
      value: value.trim(),
      raw: JSON.stringify(value.trim()),
    },
  };
};

const parseStyleString = (value) => {
  const properties = value
    .split(";")
    .map((declaration) => {
      const [property, ...rawValue] = declaration.split(":");
      const cssValue = rawValue.join(":");

      if (!property || !cssValue.trim()) return null;

      return createStyleProperty(property, cssValue);
    })
    .filter(Boolean);

  return {
    type: "JSXExpressionContainer",
    expression: {
      type: "ObjectExpression",
      properties,
    },
  };
};

const transformNode = (node) => {
  if (!node || typeof node !== "object") return;

  if (node.type === "JSXAttribute" && node.name?.name === "style") {
    if (node.value?.type === "Literal" && typeof node.value.value === "string") {
      node.value = parseStyleString(node.value.value);
    }
  }

  for (const value of Object.values(node)) {
    if (Array.isArray(value)) {
      value.forEach(transformNode);
    } else {
      transformNode(value);
    }
  }
};

export default function recmaHtmlStyles() {
  return (tree) => {
    transformNode(tree);
  };
}
