"use client";

import type { GapItem } from "@/types";

interface MissingFeaturesProps {
  features: GapItem[];
}

function ImpactBadge({ impact }: { impact: GapItem["impact"] }) {
  const styles: Record<string, string> = {
    High: "bg-red-50 text-red-700 ring-red-600/20",
    Medium: "bg-amber-50 text-amber-700 ring-amber-600/20",
    Low: "bg-slate-50 text-slate-600 ring-slate-500/20",
  };
  const icons: Record<string, string> = {
    High: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
    Medium: "M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z",
    Low: "M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[impact]}`}
    >
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d={icons[impact]} />
      </svg>
      {impact}
    </span>
  );
}

export default function MissingFeatures({ features }: MissingFeaturesProps) {
  const sorted = [...features].sort((a, b) => {
    const order = { High: 0, Medium: 1, Low: 2 };
    return order[a.impact] - order[b.impact];
  });

  return (
    <section className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <div className="p-1 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500" />
      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shrink-0 shadow-md shadow-rose-200">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Missing Features</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Features your competitors have that you&apos;re currently missing
            </p>
          </div>
        </div>

        {sorted.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium">No feature gaps detected</p>
            <p className="text-xs mt-1">Your product appears to have all the features your competitors offer.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((item, idx) => (
              <div
                key={idx}
                className="group relative rounded-xl border border-slate-200 bg-slate-50/30 p-4 sm:p-5 hover:bg-slate-50 hover:border-slate-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-medium text-slate-400 tabular-nums">
                        {String(idx + 1).padStart(2, "0")}.
                      </span>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {item.feature}
                      </h3>
                      <ImpactBadge impact={item.impact} />
                    </div>
                    <p className="mt-1.5 text-sm text-slate-600 leading-relaxed pl-6">
                      {item.reason}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
