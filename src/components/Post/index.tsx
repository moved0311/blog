import Link from "next/link";
import { formatPostDate, type Post } from "@/lib/posts";

const PostCard = (post: Post) => {
  const tags = post.tags || [];
  const displayDate = formatPostDate(post.lastUpdate ?? post.date);

  return (
    <div className="mb-8">
      <h2 className="mb-2 text-xl">
        <Link
          href={post.url}
          className="text-[#007acc] dark:text-slate-100 font-semibold"
        >
          {post.title}
        </Link>
      </h2>
      <div className="flex items-center">
        {displayDate && (
          <time dateTime={post.lastUpdate ?? post.date} className="block text-sm text-slate-500">
            {displayDate}
          </time>
        )}
        <ul className="list-none flex items-center gap-1 ml-2 font-medium">
          {tags.map((tag) => (
            <li
              key={tag}
              className="bg-[#007ACC] text-white rounded px-[6px] py-[2px] text-sm"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PostCard;
