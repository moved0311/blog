import type { ReactNode } from "react";

type CollapsibleProps = {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
};

const Collapsible = ({
  title,
  children,
  defaultOpen = false,
}: CollapsibleProps) => {
  return (
    <details
      className="group my-6 rounded border border-slate-200 p-0 text-slate-900 dark:border-slate-700 dark:text-slate-100"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 font-semibold marker:hidden [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <span
          aria-hidden="true"
          className="text-lg leading-none text-slate-500 transition-transform group-open:rotate-45 dark:text-slate-400"
        >
          +
        </span>
      </summary>
      <div className="border-t border-slate-200 px-4 py-4 dark:border-slate-700">
        {children}
      </div>
    </details>
  );
};

export default Collapsible;
