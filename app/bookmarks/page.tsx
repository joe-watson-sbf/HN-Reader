import type { Metadata } from "next";
import Nav from "../components/Nav";
import BookmarksContent from "./BookmarksContent";

export const metadata: Metadata = {
  title: "Bookmarks — HN Reader",
};

export default function BookmarksPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Nav />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-white">Bookmarks</h1>
        </div>
        <BookmarksContent />
      </main>
    </div>
  );
}
