"use client";
import { format, parseISO } from "date-fns";
import { allPosts } from "contentlayer/generated";
import { useMDXComponent } from "next-contentlayer/hooks";
import { notFound } from "next/navigation";

type PageProps = {
  params: {
    path: string;
  };
};

const Page = ({ params }: PageProps) => {
  const path = params?.path;
  const post = allPosts.find((post) => post._raw.flattenedPath === path);

  if (!post) notFound();

  const { title, date, tags, lastUpdate, body } = post;

  const MDXContent = useMDXComponent(body.code);

  return (
    <article>
      <div className="mb-8">
        <time dateTime={date} className="mb-1 text-xs text-gray-600">
          {format(parseISO(date), "LLLL d, yyyy")}
        </time>
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>
      <MDXContent />
    </article>
  );
};

export default Page;
