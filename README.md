# GapForge

AI-powered competitive feature gap analysis. Compare your product against competitors and get a structured, actionable report.

## Features

- **AI-powered competitor analysis** — Automatically compare your product against up to two competitors
- **Feature extraction** — Extracts 10–15 product features from raw webpage content
- **Feature comparison matrix** — Side-by-side table showing which product owns each feature, with mobile card view
- **Missing feature detection** — Highlights features your competitors have that you're missing, ranked by impact
- **Priority roadmap generation** — A 5-item ranked roadmap with effort estimates and priority ratings
- **Executive summary** — High-level strategic overview of the competitive landscape
- **SSRF-safe URL validation** — All submitted URLs are validated against private/internal network addresses before any request is made

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org/) 16 (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) (strict mode) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) v4 |
| AI Provider | [OpenRouter](https://openrouter.ai/) (model-agnostic) |
| Web Scraper | [Jina AI Reader](https://r.jina.ai) |
| Fonts | Geist (via `next/font`) |

## Architecture

```
User submits URLs
        │
        ▼
  ┌─────────────────┐
  │  Next.js API     │  POST /api/analyze
  │  (route.ts)      │  Validates URLs (SSRF check)
  └────────┬────────┘  Checks API keys
           │
           ▼
  ┌─────────────────┐
  │  Jina AI Reader  │  Fetches all 3 pages concurrently
  │  (fetchWithJina) │  Handles per-URL failures gracefully
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐
  │  OpenRouter      │  POST /chat/completions
  │  (lib/ai.ts)     │  Model: OPENROUTER_MODEL
  └────────┬────────┘  System prompt guides JSON output
           │
           ▼
  ┌─────────────────┐
  │  AI Analysis     │  Returns { summary, features, gaps, roadmap }
  │  (JSON parse)    │  Auto-repair on malformed JSON
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐
  │  Client renders  │  Executive Summary
  │  results in      │  Feature Comparison Table
  │  sections        │  Missing Features
                     │  Prioritized Roadmap
```

## How It Works

1. **Submit URLs** — Enter your product page URL and two competitor URLs
2. **Scrape content** — Jina AI Reader fetches and converts web pages to markdown
3. **Analyze** — OpenRouter AI compares the content and extracts features, gaps, and roadmap items
4. **View results** — A polished dashboard shows executive summary, feature matrix, missing features, and priority roadmap

## Setup

```bash
# Clone the repository
git clone <repo-url>
cd gap-analyzer

# Install dependencies
npm install

# Copy and fill in your environment variables
cp .env.local.example .env.local

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production build

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `OPENROUTER_API_KEY` | Yes | — | OpenRouter API key (get one at [openrouter.ai/keys](https://openrouter.ai/keys)) |
| `OPENROUTER_MODEL` | No | `openrouter/free` | AI model to use (change to switch providers) |
| `OPENROUTER_BASE_URL` | No | `https://openrouter.ai/api/v1` | OpenRouter base URL |
| `JINA_API_KEY` | No | — | Jina AI Reader API key (for higher rate limits) |

## Example URLs

Input URLs for testing:

- **Your Product**: `https://trello.com`
- **Competitor 1**: `https://asana.com`
- **Competitor 2**: `https://monday.com`

### Cursor

Create `.cursorrules` (or `.cursor/rules/`) to reference the project. The AI provider in `src/lib/ai.ts` is fully isolated — change `OPENROUTER_MODEL` to switch without code changes.

### Windsurf

The project uses standard Next.js conventions. The `src/` directory structure follows the App Router pattern. No Windsurf-specific configuration needed.

### GitHub Copilot

Standard TypeScript + React project. Copilot works out of the box with `.ts` and `.tsx` files. The `@/` path alias maps to `src/`.

## Known Limitations

- **Scraping quality** — Jina AI Reader converts web pages to markdown; complex SPAs or JavaScript-heavy sites may not render fully
- **AI accuracy** — The model extracts features from scraped text; feature lists may not be exhaustive
- **Two-competitor limit** — The form accepts exactly two competitors
- **No persistence** — Results are not saved; refresh the page to start over

## Future Improvements

- GitHub repository analysis — Analyze codebases instead of marketing pages
- Changelog analysis — Track feature changes over time from changelogs
- Continuous monitoring — Scheduled re-scraping with alerting on new features
- PDF export — Download analysis results as a PDF report
- Team workspaces — Shared analysis history and collaborative annotations

## Project Structure

```
src/
├── app/
│   ├── api/analyze/route.ts   # POST /api/analyze — main API endpoint
│   ├── error.tsx              # Global error boundary (runtime crash fallback)
│   ├── loading.tsx            # Full-page skeleton loader (initial page load)
│   ├── globals.css            # Global styles, Tailwind imports, custom animations
│   ├── layout.tsx             # Root layout (fonts, metadata)
│   └── page.tsx               # Home page — hero, form, results
├── components/
│   ├── AnalyzerForm.tsx       # URL input form with 3 fields
│   ├── ExecutiveSummary.tsx   # Summary card with paragraph rendering
│   ├── FeatureComparison.tsx  # Feature matrix table (desktop) + cards (mobile)
│   ├── MissingFeatures.tsx    # Missing feature cards sorted by impact
│   └── PrioritizedRoadmap.tsx # Timeline-style roadmap with effort badges
├── lib/
│   ├── ai.ts                  # OpenRouter provider (isolated AI layer)
│   └── urlValidation.ts       # SSRF-safe URL validation helpers
└── types/
    └── index.ts               # Shared TypeScript interfaces
```

## License

MIT

## Contributing

Contributions are welcome. Open an issue or submit a pull request.
