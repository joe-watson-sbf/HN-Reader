"use client";

import { createContext, useContext, useState, useCallback } from "react";

type BookmarkContextType = {
  ids: Set<number>;
  isBookmarked: (id: number) => boolean;
  toggle: (id: number) => void;
  count: number;
};

const BookmarkContext = createContext<BookmarkContextType | null>(null);

export function BookmarkProvider({
  initialIds,
  children,
}: {
  initialIds: number[];
  children: React.ReactNode;
}) {
  const [ids, setIds] = useState<Set<number>>(() => new Set(initialIds));

  const toggle = useCallback((id: number) => {
    setIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      fetch("/api/bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      }).catch(console.error);
      return next;
    });
  }, []);

  const isBookmarked = useCallback((id: number) => ids.has(id), [ids]);

  return (
    <BookmarkContext.Provider value={{ ids, isBookmarked, toggle, count: ids.size }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const ctx = useContext(BookmarkContext);
  if (!ctx) throw new Error("useBookmarks must be used within BookmarkProvider");
  return ctx;
}
