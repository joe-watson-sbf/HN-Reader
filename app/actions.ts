// Server actions are no longer used for bookmarks — we use /api/bookmark
// (a plain route handler) to avoid Next.js's automatic router refresh
// that server actions trigger unconditionally after completion.
//
// Keep this file for any future mutations that genuinely need server action semantics
// (e.g. form submissions, mutations that need to revalidate other routes).
