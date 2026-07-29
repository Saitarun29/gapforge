export interface AnalysisInput {
  productUrl: string;
  competitorUrls: string[];
}

export interface FeatureItem {
  name: string;
  product: boolean;
  competitor1: boolean;
  competitor2: boolean;
  priority: "High" | "Medium" | "Low";
}

export interface GapItem {
  feature: string;
  reason: string;
  impact: "High" | "Medium" | "Low";
}

export interface RoadmapItem {
  title: string;
  reason: string;
  effort: "Low" | "Medium" | "High";
  priority: "High" | "Medium" | "Low";
  /** How much this matters to end-users. */
  customerImpact?: "High" | "Medium" | "Low";
  /** Strategic action: Build Now, Build Later, or Ignore. */
  recommendation?: "Build Now" | "Build Later" | "Ignore";
}

export interface QuickWin {
  title: string;
  impact: string;
  effort: "Low" | "Medium" | "High";
}

export interface AnalysisResult {
  /** Overall competitive score 0–100. */
  overallScore?: number;
  /** e.g. "Market Leader", "Fast Follower", "Challenger" */
  competitivePosition?: string;
  /** 2–3 paragraph executive summary (used by ExecutiveSummary component). */
  summary: string;
  /** 1–3 quick‑win recommendations. */
  quickWins?: QuickWin[];
  /** Feature comparison matrix (used by FeatureComparison component). */
  features: FeatureItem[];
  /** Detected gaps (used by MissingFeatures component). */
  gaps: GapItem[];
  /** Prioritized roadmap (used by PrioritizedRoadmap component). */
  roadmap: RoadmapItem[];
}

export type AnalysisStatus = "idle" | "loading" | "success" | "error";
