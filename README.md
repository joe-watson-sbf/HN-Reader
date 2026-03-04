# HN-Reader — vinext Demo

A real **Hacker News reader** built to stress-test [vinext](https://github.com/nicholasgasior/vinext) — the Vite-powered reimplementation of the Next.js runtime.

The entire `app/` directory runs identically on both:

```bash
npm run dev          # Next.js on :3000
npm run dev:vinext   # vinext on Vite on :3001 — same code, different runtime
```

> Built by [Joe Watson DEV](https://github.com/joe-watson-sbf)

---

## What this demo challenges

| Feature | How it's tested |
|---|---|
| **RSC streaming** | Multiple concurrent Suspense boundaries with real HN API calls |
| **Recursive async RSC** | `CommentTree` fetches subtrees in parallel, each level streams independently |
| **`generateStaticParams` + ISR** | Story pages pre-rendered at build, revalidated every 5 min |
| **`generateMetadata`** | Dynamic metadata resolved from async server data |
| **Server Actions** | Bookmark toggle — previously used server action, now route handler to avoid router refresh |
| **`useOptimistic`** | Instant bookmark icon flip without any page re-render |
| **`next/navigation`** | `useRouter`, `usePathname`, `useTransition` in client components |
| **Proxy middleware** | `proxy.ts` stamps every response with `X-Powered-By: vinext/vite` (Next.js 16 API) |
| **Route handlers** | `/api/stories` — cached HN API proxy with `revalidate` |
| **`force-dynamic`** | Bookmarks page always renders fresh |
| **Error boundary** | `error.tsx` for graceful API failure recovery |
| **Loading UI** | `loading.tsx` skeleton screens at route and component level |

---

## Stack

- [Next.js 16](https://nextjs.org) — app router, RSC, server actions
- [vinext](https://github.com/nicholasgasior/vinext) — Vite-powered Next.js runtime
- [Vite 7](https://vitejs.dev)
- [React 19](https://react.dev) — `useOptimistic`, `useTransition`
- [Tailwind CSS v4](https://tailwindcss.com)
- [Hacker News API](https://github.com/HackerNews/API)

---

## Getting started

```bash
pnpm install

# Run on Next.js (port 3000)
pnpm dev

# Run on vinext / Vite (port 3001)
pnpm dev:vinext
```

---

## Project structure

```
app/
  lib/
    hn.ts              # HN API client (fetch + ISR cache)
    store.ts           # In-memory bookmark store (demo — swap for D1/KV in prod)
  components/
    Nav.tsx            # Server component with live bookmark count
    StoryCard.tsx      # Story card with BookmarkButton
    CommentTree.tsx    # Recursive async RSC — the hardest RSC pattern
    BookmarkButton.tsx # Client component with useOptimistic
    SearchBar.tsx      # Client component with useRouter + useTransition
  page.tsx             # Home — streaming stories, ISR revalidate=60
  loading.tsx          # Route-level skeleton
  error.tsx            # Error boundary
  actions.ts           # (reserved for future server actions)
  story/[id]/
    page.tsx           # Dynamic route — generateStaticParams + ISR + recursive comments
    loading.tsx
  bookmarks/
    page.tsx           # Bookmarks list — force-dynamic
  api/
    stories/route.ts   # Cached HN proxy route handler
    bookmark/route.ts  # Bookmark toggle (plain fetch, no router refresh)
proxy.ts               # Next.js 16 proxy middleware
```

---

## Deploy to Cloudflare Workers

vinext deploys your Next.js app to Cloudflare Workers in one command — no code changes needed:

```bash
npx vinext deploy
```

On Cloudflare, swap the in-memory bookmark store for native bindings:

```ts
import { env } from "cloudflare:workers";

// In any server component or route handler
const bookmarks = await env.KV.get("bookmarks");
```

No `getPlatformProxy()`, no custom worker entry — just import and use.

---

## Author

**Joe Watson DEV** — [github.com/joe-watson-sbf](https://github.com/joe-watson-sbf)
