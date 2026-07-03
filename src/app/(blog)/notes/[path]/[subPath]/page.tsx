import { format, parseISO } from "date-fns";
import { getPost, importMdx } from "@/lib/posts";
import { notFound } from "next/navigation";
import { type Metadata } from "next";

type PageProps = {
  params: Promise<{
    path: string;
    subPath: string;
  }>;
};

type Props = {
  params: Promise<{ path: string; subPath: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path } = await params;
  const title = `${path} | Taiyi | Dev`;

  return {
    title,
  };
}

const Page = async ({ params }: PageProps) => {
  const { path, subPath } = await params;
  const notesPath = `notes/${path}/${subPath}`;
  const post = getPost(notesPath);

  if (!post) notFound();

  const { title, date, relativePath, lastUpdate } = post;
  const { default: Content } = await importMdx(relativePath);

  return (
    <div className="dark:text-white">
      <div className="mb-8">
        <time dateTime={date} className="mb-1 text-xs text-gray-500">
          {format(parseISO(date), "LLLL d, yyyy")}
          {lastUpdate ? `  (Last update: ${format(parseISO(lastUpdate), "LLLL d, yyyy")})` : ''}
        </time>
        <h1 className="text-3xl font-bold dark:text-white">{title}</h1>
      </div>
      <article className="prose scroll-smooth md:prose-lg dark:prose-invert prose-a:no-underline prose-th:text-center prose-li:m-0 prose-ol:m-0 prose-ul:m-0 prose-h1:scroll-mt-24 prose-h2:mb-2 prose-h2:scroll-mt-24 prose-table:w-auto prose-p:m-1 prose-td:text-center">
        <Content />
      </article>
    </div>
  );
};

export default Page;
