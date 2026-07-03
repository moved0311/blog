import type { HTMLAttributes, ReactNode } from "react";
import { slugifyHeading } from "@/lib/headings";

type MdxHeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  children?: ReactNode;
};

const getText = (node: ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getText).join("");
  }

  if (node && typeof node === "object" && "props" in node) {
    const props = node.props as { children?: ReactNode };
    return getText(props.children);
  }

  return "";
};

export const MdxH1 = ({ children, id, ...props }: MdxHeadingProps) => {
  const headingId = id ?? slugifyHeading(getText(children));

  return (
    <h1 id={headingId} {...props}>
      {children}
    </h1>
  );
};

export const MdxH2 = ({ children, id, ...props }: MdxHeadingProps) => {
  const headingId = id ?? slugifyHeading(getText(children));

  return (
    <h2 id={headingId} {...props}>
      {children}
    </h2>
  );
};
