"use client";

import type { FeatureItem } from "@/types";

interface FeatureComparisonProps {
  features: FeatureItem[];
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
    </svg>
  );
}

function PriorityBadge({ priority }: { priority: FeatureItem["priority"] }) {
  const styles: Record<string, string> = {
    High: "bg-red-50 text-red-700 ring-red-600/20",
    Medium: "bg-amber-50 text-amber-700 ring-amber-600/20",
    Low: "bg-slate-50 text-slate-600 ring-slate-500/20",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset uppercase tracking-wide ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}

export default function FeatureComparison({ features }: FeatureComparisonProps) {
  const highCount = features.filter((f) => f.priority === "High").length;
  const mediumCount = features.filter((f) => f.priority === "Medium").length;
  const lowCount = features.filter((f) => f.priority === "Low").length;

  return (
    <section className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <div className="p-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-500" />
      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shrink-0 shadow-md shadow-blue-200">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Feature Comparison</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {features.length} features analyzed
            </p>
          </div>
        </div>

        {/* Summary chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 ring-1 ring-red-600/10">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            {highCount} High
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 ring-1 ring-amber-600/10">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            {mediumCount} Medium
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            {lowCount} Low
          </span>
        </div>

        {/* ═══ Desktop Table ═══ */}
        <div className="hidden sm:block overflow-x-auto -mx-6 sm:-mx-8">
          <div className="inline-block min-w-full align-middle px-6 sm:px-8">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 w-[35%]">
                    Feature
                  </th>
                  <th scope="col" className="py-3.5 px-4 text-center text-xs font-semibold uppercase tracking-wider text-indigo-600 w-[15%]">
                    <span className="hidden lg:inline">Your Product</span>
                    <span className="lg:hidden">You</span>
                  </th>
                  <th scope="col" className="py-3.5 px-4 text-center text-xs font-semibold uppercase tracking-wider text-rose-600 w-[15%]">
                    <span className="hidden lg:inline">Competitor 1</span>
                    <span className="lg:hidden">C1</span>
                  </th>
                  <th scope="col" className="py-3.5 px-4 text-center text-xs font-semibold uppercase tracking-wider text-amber-600 w-[15%]">
                    <span className="hidden lg:inline">Competitor 2</span>
                    <span className="lg:hidden">C2</span>
                  </th>
                  <th scope="col" className="py-3.5 pl-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 w-[20%]">
                    Priority
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {features.map((item, idx) => (
                  <tr
                    key={`feature-${idx}`}
                    className={`transition-colors duration-150 ${
                      idx % 2 === 0
                        ? "bg-white hover:bg-slate-50"
                        : "bg-slate-50/40 hover:bg-slate-100/50"
                    }`}
                  >
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-slate-400 w-5 shrink-0 tabular-nums">
                          {idx + 1}.
                        </span>
                        <span className="text-sm text-slate-700 font-medium">
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50/80">
                        {item.product ? <CheckIcon /> : <CrossIcon />}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50/80">
                        {item.competitor1 ? <CheckIcon /> : <CrossIcon />}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50/80">
                        {item.competitor2 ? <CheckIcon /> : <CrossIcon />}
                      </span>
                    </td>
                    <td className="py-3.5 pl-4 text-right">
                      <PriorityBadge priority={item.priority} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══ Mobile Cards ═══ */}
        <div className="sm:hidden space-y-3">
          {features.map((item, idx) => (
            <div
              key={`feature-mobile-${idx}`}
              className="rounded-xl border border-slate-200 bg-slate-50/30 p-4 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
            >
              {/* Feature name */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium text-slate-400 tabular-nums">
                  {idx + 1}.
                </span>
                <span className="text-sm font-medium text-slate-900">
                  {item.name}
                </span>
              </div>

              {/* Status row */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { label: "You", present: item.product, color: "indigo" },
                  { label: "C1", present: item.competitor1, color: "rose" },
                  { label: "C2", present: item.competitor2, color: "amber" },
                ].map((col) => (
                  <div
                    key={col.label}
                    className="flex flex-col items-center gap-1 rounded-lg bg-white py-2 px-1 border border-slate-100"
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {col.label}
                    </span>
                    {col.present ? <CheckIcon /> : <MinusIcon />}
                  </div>
                ))}
              </div>

              {/* Priority */}
              <div className="flex justify-end">
                <PriorityBadge priority={item.priority} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
