import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GapForge — AI Competitive Feature Gap Analyzer",
  description:
    "Analyze your product against competitors using AI. Get executive summaries, feature comparisons, missing features, and a prioritized roadmap.",
  keywords: [
    "competitive analysis",
    "feature gap analysis",
    "AI product analysis",
    "competitor comparison",
    "product strategy",
  ],
  openGraph: {
    title: "GapForge — AI Competitive Feature Gap Analyzer",
    description:
      "Analyze your product against competitors using AI. Get executive summaries, feature comparisons, missing features, and a prioritized roadmap.",
    type: "website",
    siteName: "GapForge",
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50">{children}</body>
    </html>
  );
}
