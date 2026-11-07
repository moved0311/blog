"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { useRef, useState } from "react";

type CodeBlockProps = ComponentPropsWithoutRef<"pre"> & {
  children?: ReactNode;
};

const CodeBlock = ({ children, ...props }: CodeBlockProps) => {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    const code = preRef.current?.querySelector("code")?.textContent ?? "";

    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={copyCode}
        className="absolute right-2 top-2 z-10 rounded-md border border-slate-600/70 bg-slate-800/90 px-2 py-1 text-xs text-slate-300 opacity-80 transition hover:bg-slate-700 hover:text-white group-hover:opacity-100"
        aria-label="Copy code"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre ref={preRef} {...props}>
        {children}
      </pre>
    </div>
  );
};

export default CodeBlock;
