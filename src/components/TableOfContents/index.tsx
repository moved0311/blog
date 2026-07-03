"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/headings";

const getPageHeadings = (): Heading[] => {
  return Array.from(document.querySelectorAll("article h1[id], article h2[id]"))
    .map((element) => ({
      id: element.id,
      level: Number(element.tagName.slice(1)) as 1 | 2,
      text: element.textContent?.trim() ?? "",
    }))
    .filter((heading) => heading.id && heading.text);
};

const TableOfContents = () => {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    setHeadings(getPageHeadings());
  }, []);

  if (headings.length === 0) return null;

  return (
    <aside className="not-prose hidden lg:block">
      <nav
        aria-label="Table of contents"
        className="toc-scrollbar-hidden fixed right-8 top-24 z-10 w-72 max-h-[calc(100vh-7rem)] overflow-y-auto py-1 text-sm"
      >
        <ol className="flex flex-col items-end gap-3">
          {headings.map((heading) => (
            <li
              key={`${heading.id}-${heading.text}`}
              className="group relative flex items-center justify-end"
            >
              <a
                href={`#${heading.id}`}
                aria-label={heading.text}
                className={`block rounded-full bg-slate-300 transition hover:bg-[#007acc] focus:outline-none focus:ring-2 focus:ring-[#007acc] focus:ring-offset-2 focus:ring-offset-white dark:bg-slate-600 dark:focus:ring-offset-[#0d1117] ${
                  heading.level === 2 ? "h-2 w-2" : "h-3 w-3"
                }`}
              >
                <span className="sr-only">{heading.text}</span>
              </a>
              <span className="pointer-events-none absolute right-5 w-max max-w-56 translate-x-2 whitespace-normal break-words rounded bg-slate-900 px-2 py-1 text-right text-xs font-medium leading-snug text-white opacity-0 shadow-lg transition group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100 dark:bg-slate-100 dark:text-slate-900">
                {heading.text}
              </span>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
};

export default TableOfContents;
