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

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org/) 16 (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) (strict mode) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) v4 |
| AI Provider | [OpenRouter](https://openrouter.ai/) (model-agnostic) |
| Web Scraper | [Jina AI Reader](https://r.jina.ai) |
| Fonts | Geist (via `next/font`) |

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/gapforge.git
cd gapforge

# Install dependencies
npm install

# Copy and fill in your environment variables
cp .env.local.example .env.local

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|---|
| `OPENROUTER_API_KEY` | Yes | — | OpenRouter API key (get one at [openrouter.ai/keys](https://openrouter.ai/keys)) |
| `OPENROUTER_MODEL` | No | `openrouter/free` | AI model to use (change to switch providers) |
| `OPENROUTER_BASE_URL` | No | `https://openrouter.ai/api/v1` | OpenRouter base URL |

## Local Development

```bash
npm run dev       # Start development server on http://localhost:3000
npm run build     # Create production build
npm run start     # Run production build
npm run lint      # Run ESLint
```

## Deployment (Vercel)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push the repository to GitHub
2. Import the project in Vercel
3. Add the following environment variables in the Vercel dashboard:
   - `OPENROUTER_API_KEY`
   - `OPENROUTER_MODEL` (optional)
   - `OPENROUTER_BASE_URL` (optional)
4. Deploy

## Screenshots

_Coming soon._

| View | Description |
|---|---|
| ![Screenshot placeholder](https://via.placeholder.com/400x250?text=Hero+%26+Form) | Hero section with URL input form |
| ![Screenshot placeholder](https://via.placeholder.com/400x250?text=Executive+Summary) | Executive summary card |
| ![Screenshot placeholder](https://via.placeholder.com/400x250?text=Feature+Matrix) | Feature comparison matrix |
| ![Screenshot placeholder](https://via.placeholder.com/400x250?text=Missing+Features) | Missing features with impact badges |
| ![Screenshot placeholder](https://via.placeholder.com/400x250?text=Roadmap) | Prioritized roadmap timeline |

## Roadmap

- [ ] GitHub repository analysis — Analyze codebases instead of marketing pages
- [ ] Changelog analysis — Track feature changes over time from changelogs
- [ ] Continuous monitoring — Scheduled re-scraping with alerting on new features
- [ ] PDF export — Download analysis results as a PDF report
- [ ] Team workspaces — Shared analysis history and collaborative annotations

## License

MIT — see [LICENSE](LICENSE) for details.
