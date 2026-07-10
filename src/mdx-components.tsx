import type { ComponentPropsWithoutRef, ComponentType, CSSProperties } from "react";
import Collapsible from "@/components/Collapsible";
import { MdxH1, MdxH2 } from "@/components/MdxHeading";
import TOC from "@/components/TableOfContents";

type MDXComponents = Record<string, ComponentType<Record<string, unknown>>>;

const toCamelCase = (value: string) => {
  return value.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
};

const parseStyleString = (value: string): CSSProperties => {
  return value.split(";").reduce<CSSProperties>((style, declaration) => {
    const [property, ...rawValue] = declaration.split(":");
    const cssValue = rawValue.join(":").trim();

    if (!property || !cssValue) return style;

    return {
      ...style,
      [toCamelCase(property.trim())]: cssValue,
    };
  }, {});
};

const MdxSpan = ({ style, ...props }: ComponentPropsWithoutRef<"span">) => {
  const normalizedStyle =
    typeof style === "string" ? parseStyleString(style) : style;

  return <span style={normalizedStyle} {...props} />;
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Collapsible: Collapsible as ComponentType<Record<string, unknown>>,
    TOC: TOC as ComponentType<Record<string, unknown>>,
    h1: MdxH1 as ComponentType<Record<string, unknown>>,
    h2: MdxH2 as ComponentType<Record<string, unknown>>,
    span: MdxSpan as ComponentType<Record<string, unknown>>,
    ...components,
  };
}
