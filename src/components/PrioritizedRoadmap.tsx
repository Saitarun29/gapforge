"use client";

import type { RoadmapItem } from "@/types";

interface PrioritizedRoadmapProps {
  items: RoadmapItem[];
}

function EffortBadge({ effort }: { effort: RoadmapItem["effort"] }) {
  const styles: Record<string, string> = {
    Low: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    Medium: "bg-amber-50 text-amber-700 ring-amber-600/20",
    High: "bg-red-50 text-red-700 ring-red-600/20",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${styles[effort]}`}
    >
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {effort}
    </span>
  );
}

function PriorityDot({ priority }: { priority: RoadmapItem["priority"] }) {
  const styles: Record<string, string> = {
    High: "bg-red-500 ring-red-200",
    Medium: "bg-amber-500 ring-amber-200",
    Low: "bg-emerald-500 ring-emerald-200",
  };
  return (
    <span
      className={`inline-flex w-2.5 h-2.5 rounded-full ring-2 ${styles[priority]}`}
    />
  );
}

const stepColors = [
  { bg: "bg-indigo-600", text: "text-white", border: "border-indigo-500" },
  { bg: "bg-indigo-500", text: "text-white", border: "border-indigo-400" },
  { bg: "bg-indigo-400", text: "text-white", border: "border-indigo-400" },
  { bg: "bg-indigo-300", text: "text-indigo-900", border: "border-indigo-300" },
  { bg: "bg-indigo-200", text: "text-indigo-900", border: "border-indigo-300" },
];

export default function PrioritizedRoadmap({ items }: PrioritizedRoadmapProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <div className="p-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500" />
      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-md shadow-indigo-200">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Priority Roadmap
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Ranked by impact and strategic value
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-[21px] top-0 bottom-0 w-0.5 bg-slate-200 hidden sm:block" />

          <div className="space-y-6 sm:space-y-0">
            {items.map((item, idx) => {
              const color = stepColors[idx] || stepColors[stepColors.length - 1];
              const isLast = idx === items.length - 1;

              return (
                <div
                  key={idx}
                  className="relative flex gap-5 sm:pb-8"
                >
                  {/* Timeline circle (desktop) */}
                  <div className="hidden sm:flex flex-col items-center shrink-0">
                    <div
                      className={`w-[42px] h-[42px] rounded-xl flex items-center justify-center text-sm font-bold ${color.bg} ${color.text} shadow-md ring-4 ring-white z-10`}
                    >
                      {idx + 1}
                    </div>
                    {!isLast && (
                      <div className="flex-1 w-0.5 bg-slate-200 min-h-[32px]" />
                    )}
                  </div>

                  {/* Card */}
                  <div className="flex-1 min-w-0 group rounded-xl border border-slate-200 bg-slate-50/30 p-4 sm:p-5 hover:bg-white hover:border-slate-300 hover:shadow-md transition-all duration-200 sm:ml-0 ml-0">
                    {/* Mobile step indicator */}
                    <div className="flex items-center gap-3 sm:hidden mb-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${color.bg} ${color.text}`}
                      >
                        {idx + 1}
                      </div>
                      <div className="flex-1 h-px bg-slate-200" />
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Title + badges */}
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <h3 className="text-sm font-semibold text-slate-900">
                            {item.title}
                          </h3>
                          <EffortBadge effort={item.effort} />
                        </div>

                        {/* Reason */}
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {item.reason}
                        </p>
                      </div>
                    </div>

                    {/* Priority footer */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <PriorityDot priority={item.priority} />
                      <span className="text-xs font-medium text-slate-400">
                        Priority:{" "}
                        <span className="text-slate-600 capitalize">
                          {item.priority.toLowerCase()}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
