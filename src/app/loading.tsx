function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200 ${className ?? ""}`}
    />
  );
}

function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-200 ${className ?? ""}`}
    />
  );
}

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col">
      {/* ═══ HERO SKELETON ═══ */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/70 via-purple-600/70 to-pink-500/70" />
        <div className="absolute inset-0 gradient-mesh opacity-40" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <div className="text-center">
            {/* Badge skeleton */}
            <div className="flex justify-center mb-8">
              <Skeleton className="h-7 w-48 rounded-full" />
            </div>

            {/* Title skeleton */}
            <div className="flex justify-center gap-2 mb-4">
              <Skeleton className="h-14 sm:h-16 lg:h-20 w-28 sm:w-36 lg:w-40 rounded-xl" />
              <Skeleton className="h-14 sm:h-16 lg:h-20 w-32 sm:w-40 lg:w-48 rounded-xl" />
            </div>

            {/* Subtitle skeleton */}
            <div className="flex flex-col items-center gap-2 mt-5 max-w-lg mx-auto">
              <Skeleton className="h-5 w-full rounded-md" />
              <Skeleton className="h-5 w-3/4 rounded-md" />
            </div>

            {/* Stats bar skeleton */}
            <div className="flex justify-center gap-8 sm:gap-12 mt-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <Skeleton className="h-3 w-20 rounded-sm" />
                  <Skeleton className="h-4 w-16 rounded-sm" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 to-transparent" />
      </header>

      {/* ═══ MAIN CONTENT SKELETON ═══ */}
      <main className="flex-1 -mt-10 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-8">
          {/* ── Input Card Skeleton ── */}
          <section>
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
              <div className="p-1 bg-gradient-to-r from-indigo-500/50 via-purple-500/50 to-pink-500/50" />
              <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-start gap-4 mb-7">
                  <SkeletonBlock className="w-11 h-11 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-48 rounded-md" />
                    <Skeleton className="h-4 w-72 rounded-md" />
                  </div>
                </div>

                {/* Fields */}
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32 rounded-sm" />
                    <SkeletonBlock className="h-11 w-full" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-28 rounded-sm" />
                      <SkeletonBlock className="h-11 w-full" />
                    </div>
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-28 rounded-sm" />
                      <SkeletonBlock className="h-11 w-full" />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-7 pt-5 border-t border-slate-100 flex items-center justify-between">
                  <Skeleton className="h-4 w-44 rounded-sm hidden sm:block" />
                  <SkeletonBlock className="h-10 w-44 rounded-xl" />
                </div>
              </div>
            </div>
          </section>

          {/* ── Executive Summary Skeleton ── */}
          <section>
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
              <div className="p-1 bg-gradient-to-r from-emerald-500/50 to-teal-500/50" />
              <div className="p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <SkeletonBlock className="w-11 h-11 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-5 w-40 rounded-md" />
                    <Skeleton className="h-4 w-56 rounded-md" />
                  </div>
                </div>
                <div className="space-y-3 pl-4 border-l-2 border-emerald-200/50">
                  <Skeleton className="h-4 w-full rounded-sm" />
                  <Skeleton className="h-4 w-11/12 rounded-sm" />
                  <Skeleton className="h-4 w-4/5 rounded-sm" />
                  <Skeleton className="h-4 w-3/4 rounded-sm" />
                </div>
              </div>
            </div>
          </section>

          {/* ── Feature Table Skeleton ── */}
          <section>
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
              <div className="p-1 bg-gradient-to-r from-blue-500/50 to-cyan-500/50" />
              <div className="p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <SkeletonBlock className="w-11 h-11 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-5 w-44 rounded-md" />
                    <Skeleton className="h-4 w-32 rounded-md" />
                  </div>
                </div>

                {/* Summary chips */}
                <div className="flex gap-2 mb-6">
                  <SkeletonBlock className="h-7 w-20 rounded-lg" />
                  <SkeletonBlock className="h-7 w-24 rounded-lg" />
                  <SkeletonBlock className="h-7 w-20 rounded-lg" />
                </div>

                {/* Desktop table skeleton (hidden on mobile) */}
                <div className="hidden sm:block">
                  {/* Table header */}
                  <div className="flex items-center gap-4 mb-4">
                    <Skeleton className="h-4 w-1/3 rounded-sm" />
                    <Skeleton className="h-4 w-[15%] rounded-sm" />
                    <Skeleton className="h-4 w-[15%] rounded-sm" />
                    <Skeleton className="h-4 w-[15%] rounded-sm" />
                    <Skeleton className="h-4 w-[20%] rounded-sm" />
                  </div>
                  {/* Table rows */}
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-4 py-3.5 ${
                        i < 5 ? "border-b border-slate-100" : ""
                      }`}
                    >
                      <Skeleton className="h-4 w-1/3 rounded-sm" />
                      <Skeleton className="h-4 w-[15%] rounded-sm" />
                      <Skeleton className="h-4 w-[15%] rounded-sm" />
                      <Skeleton className="h-4 w-[15%] rounded-sm" />
                      <Skeleton className="h-5 w-[20%] rounded-full" />
                    </div>
                  ))}
                </div>

                {/* Mobile card skeleton (visible on mobile) */}
                <div className="sm:hidden space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-slate-200 bg-slate-50/30 p-4"
                    >
                      <Skeleton className="h-4 w-3/4 rounded-sm mb-3" />
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {[1, 2, 3].map((j) => (
                          <div
                            key={j}
                            className="flex flex-col items-center gap-1.5 rounded-lg bg-white py-2 border border-slate-100"
                          >
                            <Skeleton className="h-3 w-6 rounded-sm" />
                            <SkeletonBlock className="h-5 w-5 rounded-md" />
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end">
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Missing Features Skeleton ── */}
          <section>
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
              <div className="p-1 bg-gradient-to-r from-rose-500/50 to-pink-500/50" />
              <div className="p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <SkeletonBlock className="w-11 h-11 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-5 w-36 rounded-md" />
                    <Skeleton className="h-4 w-60 rounded-md" />
                  </div>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-slate-200 bg-slate-50/30 p-4"
                    >
                      <div className="flex items-start gap-2 mb-1">
                        <Skeleton className="h-4 w-6 rounded-sm shrink-0" />
                        <Skeleton className="h-4 w-44 rounded-sm" />
                        <Skeleton className="h-5 w-16 rounded-full shrink-0" />
                      </div>
                      <Skeleton className="h-4 w-3/4 rounded-sm ml-8 mt-2" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Roadmap Skeleton ── */}
          <section>
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
              <div className="p-1 bg-gradient-to-r from-violet-500/50 to-indigo-500/50" />
              <div className="p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-8">
                  <SkeletonBlock className="w-11 h-11 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-5 w-40 rounded-md" />
                    <Skeleton className="h-4 w-52 rounded-md" />
                  </div>
                </div>

                {/* Timeline items */}
                <div className="space-y-6 sm:space-y-0">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="relative flex gap-5 sm:pb-8"
                    >
                      {/* Timeline circle (desktop) */}
                      <div className="hidden sm:flex flex-col items-center shrink-0">
                        <SkeletonBlock className="w-[42px] h-[42px]" />
                        {i < 3 && (
                          <div className="flex-1 w-0.5 min-h-[32px]">
                            <div className="h-full w-full bg-slate-200 animate-pulse rounded-full" />
                          </div>
                        )}
                      </div>

                      {/* Card */}
                      <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50/30 p-4 sm:p-5">
                        {/* Mobile step indicator */}
                        <div className="flex items-center gap-3 sm:hidden mb-3">
                          <SkeletonBlock className="w-7 h-7 rounded-lg" />
                          <div className="flex-1 h-px bg-slate-200" />
                        </div>

                        <div className="flex items-start gap-2 flex-wrap mb-2">
                          <Skeleton className="h-5 w-48 rounded-sm" />
                          <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-full rounded-sm mb-1" />
                        <Skeleton className="h-4 w-5/6 rounded-sm mb-3" />
                        <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                          <SkeletonBlock className="w-2.5 h-2.5 rounded-full" />
                          <Skeleton className="h-3 w-24 rounded-sm" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ═══ FOOTER SKELETON ═══ */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <SkeletonBlock className="w-6 h-6 rounded-md" />
              <Skeleton className="h-4 w-16 rounded-sm" />
            </div>
            <Skeleton className="h-3 w-48 rounded-sm" />
          </div>
        </div>
      </footer>
    </div>
  );
}
