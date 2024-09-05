import { compareDesc } from "date-fns";
import { allPosts } from "contentlayer/generated";
import PostCard from "@/components/Post";

export default function Home() {
  const posts = allPosts.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date)),
  );

  return (
    <div className="mx-auto max-w-3xl py-8">
      {posts.map((post) => {
        const title = post.title;
        const isDraft = post.draft;

        if (isDraft) return null;

        return <PostCard key={title} {...post} />;
      })}
    </div>
  );
}
