import { format, parseISO } from "date-fns";
import { allPosts } from "contentlayer/generated";
import { useMDXComponent } from "next-contentlayer/hooks";
import { notFound } from "next/navigation";
import { type Metadata } from "next";

type PageProps = {
  params: {
    path: string;
  };
};

type Props = {
  params: { path: string };
  searchParams?: { [key: string]: string | string[] };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path } = params;
  const title = `${path} | Taiyi | Dev`;

  return {
    title,
  };
}

const Page = ({ params }: PageProps) => {
  const path = params?.path;
  const notesPath = `notes/${path}`;

  const post = allPosts.find((post) => post._raw.flattenedPath === notesPath);

  if (!post) notFound();

  const { title, date, tags, lastUpdate, body } = post;

  const MDXContent = useMDXComponent(body.code);

  return (
    <div className="dark:text-white">
      <div className="mb-8">
        <time dateTime={date} className="mb-1 text-xs text-gray-500">
          {format(parseISO(date), "LLLL d, yyyy")}
        </time>
        <h1 className="text-3xl font-bold dark:text-white">{title}</h1>
      </div>
      <article className="prose md:prose-lg dark:prose-invert prose-a:no-underline prose-th:text-center prose-li:m-0 prose-ul:m-0 prose-h2:mb-0 prose-table:w-auto">
        <MDXContent />
      </article>
    </div>
  );
};

export default Page;
