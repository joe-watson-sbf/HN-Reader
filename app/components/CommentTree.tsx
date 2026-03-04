import { Suspense } from "react";
import { getItem, timeAgo } from "../lib/hn";

// Recursive async RSC — each nesting level fetches kids in parallel
// and streams in independently via Suspense. This is one of the hardest
// patterns to get right in RSC runtimes. Depth-capped at 6 to avoid runaway fetches.

export default async function CommentTree({
  ids,
  depth = 0,
}: {
  ids: number[];
  depth?: number;
}) {
  if (!ids.length || depth > 6) return null;

  // Fetch all comments at this level in parallel
  const comments = await Promise.all(ids.map(getItem));
  const visible = comments.filter(
    (c) => c && !c.deleted && !c.dead && c.type === "comment"
  );

  if (!visible.length) return null;

  return (
    <div className={depth > 0 ? "mt-3 border-l border-zinc-800 pl-4 ml-2" : "space-y-5"}>
      {visible.map((comment) => {
        if (!comment) return null;
        return (
          <div key={comment.id} className={depth === 0 ? "space-y-1" : "mt-3"}>
            <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1.5">
              <span className="text-zinc-300 font-medium">
                {comment.by ?? "[deleted]"}
              </span>
              <span>·</span>
              <span>{timeAgo(comment.time)}</span>
              {comment.kids && (
                <span className="text-zinc-600">
                  {comment.kids.length} repl
                  {comment.kids.length === 1 ? "y" : "ies"}
                </span>
              )}
            </div>

            {comment.text && (
              <div
                className="text-zinc-300 text-sm leading-relaxed [&_a]:text-orange-400 [&_a]:underline-offset-2 hover:[&_a]:underline [&_p]:mb-2 [&_pre]:bg-zinc-800 [&_pre]:rounded [&_pre]:p-2 [&_pre]:text-xs [&_pre]:overflow-x-auto [&_code]:text-orange-300"
                dangerouslySetInnerHTML={{ __html: comment.text }}
              />
            )}

            {/* Each subtree streams in independently */}
            {comment.kids && comment.kids.length > 0 && (
              <Suspense
                fallback={
                  <div className="mt-3 ml-6 text-xs text-zinc-600 animate-pulse">
                    ↳ loading {comment.kids.length} repl
                    {comment.kids.length === 1 ? "y" : "ies"}…
                  </div>
                }
              >
                <CommentTree ids={comment.kids} depth={depth + 1} />
              </Suspense>
            )}
          </div>
        );
      })}
    </div>
  );
}
