import Link from "next/link";
import { compareDesc, format, parseISO } from "date-fns";
import { allPosts, Post } from "contentlayer/generated";

function PostCard(post: Post) {
  const tags = post.tags || [];

  return (
    <div className="mb-8">
      <h2 className="mb-2 text-xl">
        <Link href={post.url} className="text-[#007acc]">
          {post.title}
        </Link>
      </h2>
      <div className="flex items-center">
        <time dateTime={post.date} className="mb-2 block text-sm text-gray-600">
          {format(parseISO(post.date), "LLLL d, yyyy")}
        </time>
        <ul className="list-none flex items-center gap-1 ml-2 font-medium">
          {tags.map((tag) => (
            <li key={tag} className="bg-[#007ACC] text-white rounded px-[6px] py-[2px] text-sm">
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Home() {
  const posts = allPosts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  return (
    <div className="mx-auto max-w-3xl py-8">
      <h1 className="mb-4 font-black pb-4 text-3xl font-extrabold ">Taiyi</h1>
      {posts.map((post) => (
        <PostCard key={post.title} {...post} />
      ))}
    </div>
  );
}
