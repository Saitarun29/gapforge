"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { AnalysisInput, AnalysisResult, AnalysisStatus } from "@/types";
import AnalyzerForm from "@/components/AnalyzerForm";
import ExecutiveSummary from "@/components/ExecutiveSummary";
import FeatureComparison from "@/components/FeatureComparison";
import MissingFeatures from "@/components/MissingFeatures";
import PrioritizedRoadmap from "@/components/PrioritizedRoadmap";

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);
  return mounted;
}

export default function Home() {
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();

  const handleAnalyze = useCallback(async (input: AnalysisInput) => {
    setStatus("loading");
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed. Please try again.");
      }

      setResult(data as AnalysisResult);
      setStatus("success");

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
      setStatus("error");
    }
  }, []);

  const handleRetry = useCallback(() => {
    setStatus("idle");
    setError(null);
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="flex-1 flex flex-col">
      {/* ═══ HERO ═══ */}
      <header className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500" />
        {/* Gradient mesh overlay */}
        <div className="absolute inset-0 gradient-mesh opacity-60" />
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Floating abstract shapes */}
        <div className="absolute top-12 left-1/4 w-64 h-64 rounded-full bg-white/5 blur-3xl animate-float" />
        <div className="absolute bottom-8 right-1/4 w-48 h-48 rounded-full bg-pink-300/10 blur-2xl animate-float-slow" />
        <div className="absolute top-1/2 right-1/3 w-32 h-32 rounded-full bg-amber-300/10 blur-xl animate-float" style={{ animationDelay: "2s" }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <div className="text-center">
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-8 ${
                mounted ? "opacity-100" : "opacity-0"
              } transition-opacity duration-700`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-xs font-medium text-white/90 tracking-wide">
                AI-Powered Competitive Analysis
              </span>
            </div>

            {/* Title */}
            <h1
              className={`text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              } transition-all duration-700 delay-100`}
            >
              <span className="inline-block">Gap</span>
              <span className="inline-block bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
                Forge
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className={`mt-5 text-lg sm:text-xl text-indigo-100/90 max-w-2xl mx-auto leading-relaxed ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              } transition-all duration-700 delay-200`}
            >
              Uncover competitive blind spots. Instantly compare your product
              against competitors and get an AI-driven feature gap analysis
              with an actionable roadmap.
            </p>

            {/* Stats bar */}
            <div
              className={`mt-10 flex items-center justify-center gap-8 sm:gap-12 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              } transition-all duration-700 delay-300`}
            >
              {[
                { label: "Jina AI Scraping", value: "Real-time" },
                { label: "AI Analysis", value: "OpenRouter" },
                { label: "Time to Results", value: "~45s" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                    {stat.label}
                  </div>
                  <div className="mt-1 text-sm font-medium text-white/90">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 to-transparent" />
      </header>

      {/* ═══ MAIN ═══ */}
      <main className="flex-1 -mt-10 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-8">
          {/* ── Input Form ── */}
          <section>
            <AnalyzerForm onSubmit={handleAnalyze} isLoading={status === "loading"} />
          </section>

          {/* ── Loading State ── */}
          {status === "loading" && (
            <section className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
              <div className="p-1 bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse" />
              <div className="p-8 sm:p-10 text-center">
                {/* Animated icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 mb-6">
                  <svg
                    className="animate-spin h-8 w-8 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>

                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Analyzing Your Competitors
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mb-8">
                  Fetching webpage content via Jina AI, then running AI analysis. This usually takes 30–60 seconds.
                </p>

                {/* Stage indicators */}
                <div className="max-w-sm mx-auto space-y-3">
                  {[
                    { label: "Fetching product page…", delay: 0 },
                    { label: "Fetching competitor pages…", delay: 0.8 },
                    { label: "Running AI analysis…", delay: 2.0 },
                  ].map((stage) => (
                    <div
                      key={stage.label}
                      className="flex items-center gap-3 text-sm text-slate-500"
                    >
                      <svg
                        className="w-4 h-4 text-indigo-500 animate-pulse shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        style={{ animationDelay: `${stage.delay}s` }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
                        />
                      </svg>
                      <span>{stage.label}</span>
                    </div>
                  ))}
                </div>

                {/* Bouncing dots */}
                <div className="mt-8 flex justify-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── Error State ── */}
          {status === "error" && (
            <section className="bg-white rounded-2xl shadow-lg border border-red-200/60 overflow-hidden animate-fade-in-up">
              <div className="p-1 bg-gradient-to-r from-red-500 to-rose-500" />
              <div className="p-8 sm:p-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 mb-5">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Analysis Failed
                </h3>
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-5 py-3 inline-block mb-6 max-w-lg mx-auto">
                  {error}
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleRetry}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-all duration-200 shadow-lg shadow-slate-200"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
                      />
                    </svg>
                    Try Again
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* ── Results ── */}
          {status === "success" && result && (
            <div ref={resultsRef} className="space-y-8 scroll-mt-8">
              {/* Results header */}
              <div className="flex items-center justify-between animate-fade-in-up">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-emerald-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Analysis Results
                    </h2>
                    <p className="text-sm text-slate-500">
                      {result.features.length} features compared ·{" "}
                      {result.gaps.length} gaps found · {result.roadmap.length}{" "}
                      roadmap items
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRetry}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                >
                  Analyze new URLs &rarr;
                </button>
              </div>

              {/* Sections with staggered animation */}
              <div className="animate-fade-in-up animate-fade-in-up-delay-1">
                <ExecutiveSummary summary={result.summary} />
              </div>
              <div className="animate-fade-in-up animate-fade-in-up-delay-2">
                <FeatureComparison features={result.features} />
              </div>
              <div className="animate-fade-in-up animate-fade-in-up-delay-3">
                <MissingFeatures features={result.gaps} />
              </div>
              <div className="animate-fade-in-up animate-fade-in-up-delay-4">
                <PrioritizedRoadmap items={result.roadmap} />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
                G
              </div>
              <span className="text-sm font-medium text-slate-700">
                GapForge
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Powered by{" "}
              <span className="font-medium text-slate-500">Jina AI</span> &amp;{" "}
              <span className="font-medium text-slate-500">OpenRouter</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
