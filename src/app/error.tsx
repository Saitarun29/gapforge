"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // In development, log the full error for debugging
    if (process.env.NODE_ENV === "development") {
      console.error("Uncaught runtime error:", error);
    }
  }, [error]);

  return (
    <div className="flex-1 flex flex-col">
      {/* ═══ ERROR HERO ═══ */}
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

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 lg:py-32">
          <div className="text-center">
            {/* Brand */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white">
              <span className="inline-block">Gap</span>
              <span className="inline-block bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
                Forge
              </span>
            </h1>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 to-transparent" />
      </header>

      {/* ═══ ERROR CARD ═══ */}
      <main className="flex-1 -mt-10 relative z-10">
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden">
            <div className="p-1 bg-gradient-to-r from-red-500 to-rose-500" />
            <div className="p-8 sm:p-10 text-center">
              {/* Error icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 mb-6">
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
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>

              {/* Heading */}
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                Something went wrong
              </h2>

              {/* Explanation */}
              <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto mb-8">
                An unexpected error occurred. This is on us — please try again.
                If the problem persists, check that your API keys are configured
                correctly.
              </p>

              {/* Actions */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={reset}
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

                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
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
                      d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                    />
                  </svg>
                  Go Home
                </Link>
              </div>

              {/* Dev-only error details */}
              {process.env.NODE_ENV === "development" && error.digest && (
                <p className="mt-6 text-[11px] text-slate-400 font-mono">
                  Error digest: {error.digest}
                </p>
              )}
            </div>
          </div>
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
