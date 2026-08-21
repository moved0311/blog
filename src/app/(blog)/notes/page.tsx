import { getAllPosts, type Post } from "@/lib/posts";
import { type Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Notes | Taiyi | Dev" };
}

type NoteGroup = {
  key: string;
  title: string;
  index?: Post;
  notes: Post[];
};

const titleFromKey = (key: string) =>
  key
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const NoteLink = ({ note }: { note: Post }) => (
  <li>
    <Link
      href={note.url}
      className="group flex items-center justify-between gap-4 rounded-xl border border-transparent px-3 py-2.5 text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 dark:text-slate-200 dark:hover:border-sky-900/70 dark:hover:bg-sky-950/50 dark:hover:text-sky-300"
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300 transition group-hover:bg-sky-500 dark:bg-slate-600 dark:group-hover:bg-sky-400" />
        <span className="truncate">{note.title}</span>
      </span>
      <span className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-sky-500 dark:text-slate-600 dark:group-hover:text-sky-400">
        →
      </span>
    </Link>
  </li>
);

const Page = () => {
  const groups = new Map<string, NoteGroup>();

  getAllPosts()
    .filter((post) => post._raw.flattenedPath.startsWith("notes/"))
    .forEach((note) => {
      const parts = note._raw.flattenedPath.split("/").slice(1);
      const key = parts[0];
      const group = groups.get(key) ?? {
        key,
        title: titleFromKey(key),
        notes: [],
      };

      if (parts.length === 1) {
        group.index = note;
        group.title = note.title;
      } else {
        group.notes.push(note);
      }

      groups.set(key, group);
    });

  const sortedGroups = Array.from(groups.values()).sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  return (
    <main className="mx-auto max-w-5xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
      <div className="mb-9">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-[#f8fafc] sm:text-5xl">
          Notes
        </h1>
      </div>

      <section
        className="grid items-start gap-3 sm:grid-cols-2"
        aria-label="筆記分類"
      >
        {sortedGroups.map((group) => {
          const count = group.notes.length + (group.index ? 1 : 0);

          return (
            <details
              key={group.key}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-sky-300 hover:shadow-md dark:border-[#263449] dark:bg-[#111a28] dark:shadow-none dark:hover:border-[#1677b7]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 marker:hidden [&::-webkit-details-marker]:hidden">
                <span className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sm font-bold text-sky-700 dark:bg-[#123b58] dark:text-[#65c7ff]">
                    {group.title.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="truncate font-semibold text-slate-800 dark:text-[#e5edf7]">
                    {group.title}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-3 text-sm text-slate-400 dark:text-[#7f9bb5]">
                  {count}
                  <span className="text-lg leading-none transition-transform group-open:rotate-180">
                    ↓
                  </span>
                </span>
              </summary>

              <div className="border-t border-slate-100 px-3 pb-3 pt-2 dark:border-[#263449] dark:bg-[#0d1420]">
                <ul className="space-y-0.5">
                  {group.index && <NoteLink note={group.index} />}
                  {group.notes
                    .sort((a, b) => a.title.localeCompare(b.title))
                    .map((note) => (
                      <NoteLink key={note.url} note={note} />
                    ))}
                </ul>
              </div>
            </details>
          );
        })}
      </section>
    </main>
  );
};
export default Page;
