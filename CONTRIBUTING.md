# Contributing to GapForge

We welcome contributions! Here's how you can help.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/gapforge.git`
3. Create a feature branch: `git checkout -b feature/my-feature`
4. Install dependencies: `npm install`
5. Copy environment variables: `cp .env.local.example .env.local`
6. Add your OpenRouter API key to `.env.local`
7. Start the dev server: `npm run dev`

## Development Guidelines

- **No API keys in code** — All secrets belong in `.env.local` only.
- **TypeScript strict mode** — Write typed code. Avoid `any`.
- **Tailwind CSS** — Use utility classes. Avoid custom CSS when possible.
- **AI layer isolation** — All AI provider logic lives in `src/lib/ai.ts`. Keep it that way.
- **SSRF safety** — All user-supplied URLs must pass through `validatePublicUrl()`.

## Code Quality

```bash
npm run lint   # Check for lint errors
npm run build  # Verify production build
```

Fix all lint and build errors before submitting.

## Pull Request Process

1. Update the README.md if your change affects the user workflow or environment variables.
2. Update CHANGELOG.md with a brief description of your change.
3. Ensure all CI checks pass.
4. Submit the PR with a clear description of what it does and why.

## Commit Messages

Use clear, descriptive commit messages:

```
feat: add PDF export for analysis results
fix: handle timeout when Jina AI is unreachable
docs: update deployment section in README
chore: bump dependencies
```

## Questions?

Open a GitHub Discussion or issue. We're happy to help.
