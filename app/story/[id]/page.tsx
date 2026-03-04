import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getItem, getTopStories, timeAgo, domain } from "../../lib/hn";
import { store } from "../../lib/store";
import CommentTree from "../../components/CommentTree";
import BookmarkButton from "../../components/BookmarkButton";
import Nav from "../../components/Nav";

// Pre-render the top 10 stories at build time
export async function generateStaticParams() {
  const ids = await getTopStories(10);
  return ids.map((id) => ({ id: String(id) }));
}

// ISR: revalidate every 5 minutes
export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const story = await getItem(Number(id));
  if (!story) return { title: "Not found" };
  return {
    title: `${story.title} — HN Reader`,
    description: `${story.score} points · ${story.descendants ?? 0} comments · by ${story.by}`,
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const story = await getItem(Number(id));

  if (!story || story.type === "comment") {
    notFound();
  }

  const host = domain(story.url);
  const isBookmarked = store.has(story.id);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-6"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to stories
        </Link>

        {/* Story header */}
        <article className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-semibold text-white leading-snug mb-2">
                {story.title}
              </h1>
              {host && (
                <a
                  href={story.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
                >
                  {host} ↗
                </a>
              )}
            </div>
            <BookmarkButton
              id={story.id}
              title={story.title ?? ""}
              url={story.url}
              initialBookmarked={isBookmarked}
            />
          </div>

          <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-500">
            <span className="text-orange-400 font-semibold">
              {story.score} pts
            </span>
            <span>by {story.by}</span>
            <span>{timeAgo(story.time)}</span>
            <span>{story.descendants ?? 0} comments</span>
          </div>

          {story.text && (
            <div
              className="mt-4 pt-4 border-t border-zinc-800 text-zinc-300 text-sm leading-relaxed [&_a]:text-orange-400 [&_a]:underline-offset-2 hover:[&_a]:underline [&_p]:mb-3"
              dangerouslySetInnerHTML={{ __html: story.text }}
            />
          )}
        </article>

        {/* Comments — the recursive async RSC tree */}
        <section>
          <h2 className="text-sm font-medium text-zinc-400 mb-5">
            {story.descendants ?? 0} Comments
          </h2>

          {story.kids && story.kids.length > 0 ? (
            <Suspense
              fallback={
                <div className="space-y-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-20 bg-zinc-900 border border-zinc-800 rounded-xl animate-pulse"
                      style={{ opacity: 1 - i * 0.12 }}
                    />
                  ))}
                </div>
              }
            >
              {/* Each level of this tree is a separate async RSC that streams independently */}
              <CommentTree ids={story.kids} />
            </Suspense>
          ) : (
            <p className="text-zinc-500 text-sm">No comments yet.</p>
          )}
        </section>
      </main>
    </div>
  );
}
