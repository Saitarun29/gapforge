import { NextRequest, NextResponse } from "next/server";
import type { AnalysisResult } from "@/types";
import { analyzeWithAI, AiError } from "@/lib/ai";
import { validatePublicUrl } from "@/lib/urlValidation";

interface FetchedContent {
  url: string;
  content: string | null;
  error: string | null;
}

async function fetchWithJina(url: string): Promise<FetchedContent> {
  try {
    const jinaUrl = `https://r.jina.ai/http://${url}`;

    const response = await fetch(jinaUrl, {
      headers: { Accept: "text/markdown" },
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      return {
        url,
        content: null,
        error: `Jina AI returned ${response.status}: ${text || response.statusText}`,
      };
    }

    const text = await response.text();
    return { url, content: text, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown fetch error";
    return { url, content: null, error: message };
  }
}

function combineContent(
  product: FetchedContent,
  competitors: FetchedContent[]
): { productContent: string | null; competitorContents: (string | null)[] } {
  return {
    productContent: product.content,
    competitorContents: competitors.map((c) => c.content),
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productUrl, competitorUrls } = body;

    // Validate input
    if (!productUrl) {
      return NextResponse.json(
        { error: "productUrl is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(competitorUrls) || competitorUrls.length === 0) {
      return NextResponse.json(
        { error: "competitorUrls must be a non-empty array" },
        { status: 400 }
      );
    }

    // Validate all URLs against SSRF and malformed-input risks
    const allUrls = [productUrl, ...competitorUrls];
    const validatedUrls: string[] = [];
    for (const url of allUrls) {
      const result = validatePublicUrl(url);
      if (!result.valid || !result.normalized) {
        return NextResponse.json(
          { error: result.error || "Invalid or unsupported URL." },
          { status: 400 }
        );
      }
      validatedUrls.push(result.normalized);
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "OPENROUTER_API_KEY is not configured." },
        { status: 500 }
      );
    }

    // Fetch all URLs concurrently — gracefully handle individual failures
    const results = await Promise.all(validatedUrls.map(fetchWithJina));

    const [productResult, ...competitorResults] = results;

    // Check if the product page itself failed
    if (productResult.error) {
      return NextResponse.json(
        {
          error: `Failed to fetch product page: ${productResult.error}`,
          details: {
            product: productResult.error,
            competitors: competitorResults.map((r) => r.error),
          },
        },
        { status: 502 }
      );
    }

    // Combine markdown content (nulls for failed competitor fetches)
    const { productContent, competitorContents } = combineContent(
      productResult,
      competitorResults
    );

    // Check that at least one competitor content was fetched
    const hasAnyCompetitorContent = competitorContents.some((c) => c !== null);
    if (!hasAnyCompetitorContent) {
      return NextResponse.json(
        {
          error: "Failed to fetch all competitor pages",
          details: {
            product: null,
            competitors: competitorResults.map((r) => r.error),
          },
        },
        { status: 502 }
      );
    }

    // Replace null competitor content with a placeholder
    const filledCompetitorContents = competitorContents.map(
      (c, i) =>
        c ||
        `[Failed to fetch competitor ${i + 1} content. Analysis will be limited.]`
    );

    // Analyze with OpenRouter AI
    const analysis: AnalysisResult = await analyzeWithAI(
      productContent!,
      filledCompetitorContents
    );

    return NextResponse.json(analysis);
  } catch (error) {
    if (error instanceof AiError) {
      console.error("AI analysis error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 502 });
    }

    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Analysis error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
