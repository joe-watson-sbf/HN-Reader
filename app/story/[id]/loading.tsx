export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="sticky top-0 h-14 border-b border-zinc-800 bg-zinc-950/90" />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse mb-6" />
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
          <div className="h-6 bg-zinc-800 rounded animate-pulse mb-3 w-3/4" />
          <div className="h-4 bg-zinc-800 rounded animate-pulse mb-4 w-1/4" />
          <div className="flex gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-3 w-16 bg-zinc-800 rounded animate-pulse" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-20 bg-zinc-900 border border-zinc-800 rounded-xl animate-pulse"
              style={{ opacity: 1 - i * 0.12 }}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
