export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="sticky top-0 h-14 border-b border-zinc-800 bg-zinc-950/90" />
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-3">
        <div className="h-24 bg-zinc-900 rounded-xl animate-pulse mb-6" />
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-[72px] bg-zinc-900 border border-zinc-800 rounded-xl animate-pulse"
            style={{ opacity: 1 - i * 0.06 }}
          />
        ))}
      </main>
    </div>
  );
}
