import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Post } from "contentlayer/generated";

const PostCard = (post: Post) => {
  const tags = post.tags || [];
  const lastUpdate = post.lastUpdate

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
        <time dateTime={post.date} className="block text-sm text-slate-500">
          {lastUpdate ? format(parseISO(lastUpdate), "LLLL d, yyyy") : format(parseISO(post.date), "LLLL d, yyyy")}
        </time>
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
