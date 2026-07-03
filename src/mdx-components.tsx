import type { ComponentType } from "react";
import Collapsible from "@/components/Collapsible";
import { MdxH1, MdxH2 } from "@/components/MdxHeading";
import TOC from "@/components/TableOfContents";

type MDXComponents = Record<string, ComponentType<Record<string, unknown>>>;

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Collapsible: Collapsible as ComponentType<Record<string, unknown>>,
    TOC: TOC as ComponentType<Record<string, unknown>>,
    h1: MdxH1 as ComponentType<Record<string, unknown>>,
    h2: MdxH2 as ComponentType<Record<string, unknown>>,
    ...components,
  };
}
