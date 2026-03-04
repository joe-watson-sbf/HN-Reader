import { NextRequest } from "next/server";
import { store } from "../../lib/store";

export async function POST(request: NextRequest) {
  const { id, title, url } = await request.json();

  if (!id || typeof id !== "number") {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  const bookmarked = store.toggle({ id, title, url });
  return Response.json({ bookmarked, count: store.count() });
}
