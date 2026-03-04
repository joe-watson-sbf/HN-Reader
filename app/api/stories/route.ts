import { NextRequest } from "next/server";
import {
  getTopStories,
  getNewStories,
  getAskStories,
  getItems,
} from "../../lib/hn";

// Route handler: proxies HN API with caching
export const revalidate = 60;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type") ?? "top";
  const limit = Math.min(Number(searchParams.get("limit") ?? "30"), 100);

  const ids =
    type === "new"
      ? await getNewStories(limit)
      : type === "ask"
        ? await getAskStories(limit)
        : await getTopStories(limit);

  const stories = await getItems(ids);

  return Response.json(
    {
      stories,
      meta: {
        type,
        count: stories.length,
        revalidate: revalidate,
        servedAt: new Date().toISOString(),
        runtime: process.env.npm_lifecycle_event ?? "unknown",
      },
    },
    {
      headers: {
        "Cache-Control": `s-maxage=${revalidate}, stale-while-revalidate`,
      },
    }
  );
}
