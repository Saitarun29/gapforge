import type { AnalysisResult } from "@/types";

// ── Error class ───────────────────────────────────────────────────────────

export class AiError extends Error {
  constructor(
    message: string,
    public readonly status?: number
  ) {
    super(message);
    this.name = "AiError";
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────

/** Map HTTP status codes to user-facing messages. */
function statusToMessage(status: number, fallback: string): string {
  const messages: Record<number, string> = {
    401: "Authentication failed. Check your OPENROUTER_API_KEY.",
    403: "Access denied. Your API key may not have permission for this model.",
    404: "The requested model is unavailable. Check OPENROUTER_MODEL.",
    408: "The AI provider timed out. Please try again.",
    429: "Rate limit exceeded. Wait a moment and try again.",
  };
  return messages[status] || fallback;
}

/**
 * Safely extract a JSON object from raw model output.
 *
 * Strategy:
 * 1. Trim whitespace.
 * 2. Find the first '{' and the last '}' — extract only that substring.
 * 3. Strip markdown code fences if they wrap the extracted block.
 * 4. Remove trailing commas before closing braces/brackets.
 * 5. Parse with JSON.parse().
 */
function extractAndParseJSON(raw: string): {
  parsed: AnalysisResult | null;
  extracted: string;
} {
  let cleaned = raw.trim();

  // Step 1 — find the JSON object boundaries
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    return { parsed: null, extracted: cleaned };
  }

  cleaned = cleaned.slice(firstBrace, lastBrace + 1);

  // Step 2 — remove trailing commas before closing braces/brackets
  cleaned = cleaned.replace(/,(\s*[}\]])/g, "$1");

  // Step 4 — attempt parse
  try {
    const parsed = JSON.parse(cleaned);
    return { parsed, extracted: cleaned };
  } catch {
    return { parsed: null, extracted: cleaned };
  }
}

/** Validate parsed object matches the expected AnalysisResult shape. */
function validateResult(obj: unknown): obj is AnalysisResult {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return false;

  const r = obj as Record<string, unknown>;

  if (
    typeof r.summary !== "string" ||
    !Array.isArray(r.features) ||
    !Array.isArray(r.gaps) ||
    !Array.isArray(r.roadmap)
  ) {
    return false;
  }

  return true;
}

/**
 * Clean scraped markdown content by removing noise and keeping only
 * the meaningful sections for competitive analysis.
 *
 * Removes:
 *   - Navigation, footer, privacy policy, terms, legal text
 *   - Cookie notices, language selectors
 *   - Duplicate links, repetitive menus, image-only lines
 *   - Lines that are just URLs or image references
 *
 * Keeps key sections: Features, Product, Pricing, Docs, Integrations,
 * Security, AI, API — or the first ~4000 meaningful characters.
 */
function cleanContent(raw: string): string {
  // ── Noise patterns (case-insensitive) ────────────────────────────────
  const noisePatterns = [
    /^(navigation|nav|menu|footer|header|sidebar)\b/i,
    /\b(privacy|privacy policy|cookie|cookies|terms of service|terms of use)\b/i,
    /\b(legal|legal notice|disclaimer|all rights reserved)\b/i,
    /\b(accept cookies|accept all|cookie settings|manage cookies)\b/i,
    /\b(consent|gdpr|cookie notice|this site uses cookies)\b/i,
    /\b(sign in|sign up|log in|register|subscribe|newsletter)\b/i,
    /\b(language.select|select language|choose language|read in your language)\b/i,
    /^\|\s*(language|lang|page|section|menu|nav)\s*\|/i,
    /^\[Image \d+\]/,
    /^!\[.*?\]\(/,
    /^\(https?:\/\//,
    /^<\/?[a-z]+/i,
    /^\*\s*\[.*?\]\(.*?\)\s*-/,
    /^\d+,?\d*\+?\s*(articles|entries|items)/i,
  ];

  // ── Key sections to preserve (case-insensitive match) ────────────────
  const keySectionHeaders = [
    /^#+\s*(features|key features|capabilities|what you can do)/i,
    /^#+\s*(product|overview|platform|how it works)/i,
    /^#+\s*(pricing|plans|enterprise)/i,
    /^#+\s*(docs|documentation|developer|api|integrations)/i,
    /^#+\s*(security|trust|compliance|privacy)/i,
    /^#+\s*(ai|artificial intelligence|agents|automation)/i,
  ];

  const lines = raw.split("\n");
  const seen = new Set<string>();
  const kept: string[] = [];
  let inNoiseSection = false;
  let meaningfulCharCount = 0;
  const MAX_CHARS = 4000;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) {
      // Keep blank lines for structure
      if (kept.length > 0) kept.push("");
      continue;
    }

    const trimmed = line.trim();

    // ── Skip pure noise lines ───────────────────────────────────────────
    if (noisePatterns.some((p) => p.test(trimmed))) {
      // Check if this is a section header like "Language" that could be useful
      const isKeySection = keySectionHeaders.some((p) => p.test(trimmed));
      if (!isKeySection) {
        inNoiseSection = true;
        continue;
      }
    }

    // ── Detect end of noise section (next heading or blank line after noise) ──
    if (inNoiseSection && (trimmed.startsWith("#") || trimmed === "")) {
      inNoiseSection = false;
    }
    if (inNoiseSection) continue;

    // ── Skip image-only lines ───────────────────────────────────────────
    if (/^!\[.*?\]\(.*?\)/.test(trimmed)) continue;

    // ── Skip lines that are just URLs ───────────────────────────────────
    if (/^https?:\/\/\S+$/.test(trimmed)) continue;

    // ── Skip markdown table rows that contain only links/images ────────
    if (/^\|.*\[.*?\]\(.*?\).*\|$/.test(trimmed) && !/[a-zA-Z]{4,}/.test(trimmed)) continue;

    // ── Deduplicate multiple-image and link-only table rows ─────────────
    const normalized = trimmed.replace(/\s+/g, " ");
    if (seen.has(normalized)) continue;
    seen.add(normalized);

    // ── Keep the line ───────────────────────────────────────────────────
    kept.push(line);
    meaningfulCharCount += line.length;

    if (meaningfulCharCount >= MAX_CHARS) break;
  }

  let result = kept.join("\n").trim();

  // ── If we trimmed a lot, note that we summarized ─────────────────────
  const trimmedLen = result.length;
  if (trimmedLen < raw.length) {
    const reduction = Math.round((1 - trimmedLen / raw.length) * 100);
    // Add a note if more than 50% was removed
    if (reduction > 50) {
      result += `\n\n[Content summarized: reduced by ~${reduction}%. Only key sections retained.]`;
    }
  }

  return result;
}

/** Build the user prompt from scraped content. */
function buildPrompt(
  productContent: string,
  competitorContents: string[]
): string {
  const cleanedProduct = cleanContent(productContent);
  const cleanedCompetitors = competitorContents.map(cleanContent);

  const compSections = cleanedCompetitors
    .map((content, i) => `# COMPETITOR ${i + 1}:\n${content}`)
    .join("\n\n");

  const prompt = `# PRODUCT (Your Product):
${cleanedProduct}

${compSections}

Analyze the content above and return a **valid JSON object** with this exact structure:

{
  "overallScore": 0-100,
  "competitivePosition": "Market Leader | Fast Follower | Challenger | Niche Player",
  "summary": "A 2-3 paragraph executive summary of the competitive landscape, key differentiators, and strategic recommendations.",
  "quickWins": [
    {
      "title": "Quick win description",
      "impact": "Description of expected impact",
      "effort": "Low | Medium | High"
    }
  ],
  "features": [
    {
      "name": "Canonical feature name (after normalizing duplicates across products)",
      "product": true/false,
      "competitor1": true/false,
      "competitor2": true/false,
      "priority": "High | Medium | Low"
    }
  ],
  "gaps": [
    {
      "feature": "Feature name that your product is missing",
      "reason": "Why this feature matters and its potential impact",
      "impact": "High | Medium | Low"
    }
  ],
  "roadmap": [
    {
      "title": "Feature name",
      "reason": "Why this should be prioritized now",
      "priority": "High | Medium | Low",
      "effort": "Low | Medium | High",
      "customerImpact": "High | Medium | Low",
      "recommendation": "Build Now | Build Later | Ignore"
    }
  ]
}

## Workflow

1. Extract every customer-facing feature from the product page.
2. Extract every customer-facing feature from each competitor page.
3. Normalize duplicate feature names across all products. For example:
   - "AI Search", "Semantic Search", "Smart Search" → "Semantic Search"
   - "Analytics Dashboard", "Reporting Dashboard", "Metrics Dashboard" → "Analytics Dashboard"
4. Build an accurate comparison matrix from the normalized features.
5. Detect capabilities your product is missing that competitors have.
6. Ignore purely marketing claims (e.g. "best-in-class", "industry-leading") — focus on real features.
7. Prioritize missing features using:
   - Customer Impact — how much value this adds to end-users
   - Competitive Pressure — how important this is to stay competitive
   - Business Value — revenue, retention, or differentiation potential
   - Implementation Effort — engineering cost to build

## Rules
- Extract at least 10-15 features for comparison
- List 3-8 gap features
- Provide exactly 5 roadmap items
- Include 1-3 quick wins
- Be objective and data-driven
- If uncertain about a feature, mark it as not present rather than guessing
- Never invent features that are not supported by the supplied content
- Return ONLY valid JSON, no markdown, no code fences, no extra text`;

  return prompt;
}

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Analyzes product vs competitor content using OpenRouter's Chat Completions API.
 *
 * Environment variables:
 *   OPENROUTER_API_KEY  – required
 *   OPENROUTER_BASE_URL – defaults to https://openrouter.ai/api/v1
 *   OPENROUTER_MODEL    – defaults to openrouter/free
 *
 * Change OPENROUTER_MODEL to switch AI provider without any code changes.
 */
export async function analyzeWithAI(
  productContent: string,
  competitorContents: string[]
): Promise<AnalysisResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new AiError("OPENROUTER_API_KEY is not configured");
  }

  const baseUrl =
    process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";
  const model = process.env.OPENROUTER_MODEL || "openrouter/free";

  const prompt = buildPrompt(productContent, competitorContents);

  const requestBody = {
    model,
    messages: [
      {
        role: "system",
        content: [
          "You are a senior SaaS Product Manager performing a competitive feature gap analysis.",
          "",
          "Return ONLY valid JSON. Do NOT use markdown. Do NOT wrap JSON inside code fences.",
          "Do NOT explain your reasoning. Do NOT include any text before or after the JSON.",
          "Output must be directly parseable using JSON.parse().",
        ].join("\n"),
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.2,
    max_tokens: 4000,
  };

  // ── Make the API request ──────────────────────────────────────────────
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://localhost:3000",
      "X-Title": "AI Competitive Feature Gap Analyzer",
    },
    body: JSON.stringify(requestBody),
  });

  // ── Handle HTTP errors ────────────────────────────────────────────────
  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    const message = statusToMessage(
      response.status,
      `OpenRouter API error (${response.status}): ${errorText || response.statusText}`
    );
    throw new AiError(message, response.status);
  }

  // ── Parse JSON from raw text ──────────────────────────────────────────
  const rawResponseText = await response.text();
  let data: { choices?: Array<{ message?: { content?: string }; finish_reason?: string }> };
  try {
    data = JSON.parse(rawResponseText);
  } catch (parseErr) {
    console.error("[ai.ts] Failed to parse OpenRouter response as JSON:", parseErr);
    throw new AiError(
      `OpenRouter returned invalid JSON. Raw body: ${rawResponseText.slice(0, 500)}`,
      502
    );
  }

  const content: string | undefined = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new AiError(
      `OpenRouter returned an empty response. Complete response: ${rawResponseText.slice(0, 2000)}`,
      422
    );
  }

  // ── Extract and parse JSON ────────────────────────────────────────────
  const { parsed, extracted } = extractAndParseJSON(content);

  if (parsed && validateResult(parsed)) {
    if (process.env.NODE_ENV === "development") {
      console.debug("[ai.ts] Successfully parsed AI response.");
    }
    return parsed;
  }

  // Parse failed — log the raw content for debugging
  console.error("[ai.ts] Raw model response that failed to parse:\n", content);
  console.error("[ai.ts] Extracted JSON string that failed:\n", extracted);

  throw new AiError(
    "Failed to parse AI response as JSON. The model returned an invalid format.",
    422
  );
}
