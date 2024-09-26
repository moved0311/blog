import { allPosts } from "contentlayer/generated";
import { type Metadata } from "next";
import clsx from "clsx";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const title = `Notes | Taiyi | Dev`;

  return {
    title,
  };
}

const Page = () => {
  const notes = allPosts.filter((post) =>
    post._raw.flattenedPath.startsWith("notes/"),
  );

  notes.sort((a, b) => {
    if (a.url > b.url) return 1;
    if (a.url < b.url) return -1;
    return 0;
  });

  return (
    <div className="dark:text-white">
      <ul>
        {notes.map((note) => {
          const title = note.title;
          const url = note.url;
          const paths = url.split("/");
          const path = paths[2];
          const subPath = paths[3];

          return (
            <li
              key={note.title}
              className={clsx("list-disc", {
                "ml-4 list-square": Boolean(subPath),
              })}
            >
              <Link href={url}>{title}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default Page;
