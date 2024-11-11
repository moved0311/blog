import { compareDesc } from "date-fns";
import { allPosts } from "contentlayer/generated";
import PostCard from "@/components/Post";

export default function Home() {
  const posts = allPosts.sort((a, b) => {
    const date_a = new Date(a.lastUpdate || a.date);
    const date_b = new Date(b.lastUpdate || b.date);
    return compareDesc(date_a, date_b);
  });

  return (
    <div className="mx-auto max-w-3xl py-8">
      {posts.map((post) => {
        const title = post.title;
        const isNote = post.category === "note";
        const isDraft = post.draft;

        if (isNote || isDraft) return null;

        return <PostCard key={title} {...post} />;
      })}
    </div>
  );
}
