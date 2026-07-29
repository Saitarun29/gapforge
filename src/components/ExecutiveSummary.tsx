"use client";

interface ExecutiveSummaryProps {
  summary: string;
}

export default function ExecutiveSummary({ summary }: ExecutiveSummaryProps) {
  const paragraphs = summary.split("\n").filter(Boolean);

  return (
    <section className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <div className="p-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500" />
      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0 shadow-md shadow-emerald-200">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Executive Summary</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              High-level competitive landscape overview and strategic recommendations
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="relative pl-4 border-l-2 border-emerald-200 space-y-4">
          {paragraphs.map((paragraph, idx) => (
            <p
              key={idx}
              className="text-sm sm:text-base text-slate-600 leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
