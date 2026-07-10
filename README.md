# Board — a job board

A job board built as a live "departures board": open roles, urgent hires, and new postings, laid out like an airport display instead of a generic card grid. React + TypeScript + Tailwind CSS v4, no backend — data lives in the browser via `localStorage`, which keeps the demo self-contained and instantly deployable.

**Live demo:** _add your Vercel URL here after deploying_
**Repo:** _add your GitHub URL here after pushing_

## Why it looks the way it does

Most AI-generated job boards default to a generic card grid. This one leans into what a job board actually is — a live list that people scan quickly — and borrows the visual language of a split-flap departures board: a monospace reference code per row, salary and timestamps in tabular figures, and color-coded status flags (`OPEN` / `URGENT HIRE` / `NEW` / `FILLED`). See [FEATURES.md](./FEATURES.md) for the full feature-by-feature breakdown.

## Tech stack

- **React 19 + TypeScript** — component logic and type safety
- **Vite** — dev server and production bundler
- **Tailwind CSS v4** — styling, driven by a small custom design-token theme in `src/index.css`
- **lucide-react** — icon set
- **localStorage** — persistence for saved jobs, posted jobs, applications, and theme preference (no backend required)

## Getting started

```bash
npm install
npm run dev       # starts the dev server at http://localhost:5173
```

Other scripts:

```bash
npm run build      # typecheck + production build to dist/
npm run preview    # serve the production build locally
npm run lint        # run oxlint
```

## Project structure

```
src/
  components/     # UI building blocks (JobList, JobDetailPanel, modals, etc.)
  context/        # BoardContext — global state (jobs, saved jobs, applications, toasts)
  data/           # seed job listings used on first load
  hooks/          # useLocalStorage
  types/          # shared TypeScript types
  utils/          # formatting helpers (salary, relative time)
.github/workflows/ci-cd.yml   # CI/CD pipeline (see below)
vercel.json                    # explicit Vercel build config
```

## CI/CD pipeline

`.github/workflows/ci-cd.yml` defines two jobs:

1. **`ci`** — runs on every push and every pull request: installs dependencies, lints, typechecks, and builds the app. Nothing deploys unless this passes.
2. **`deploy`** — runs only after `ci` passes, and only on pushes to `main`. It uses the Vercel CLI (`vercel pull` → `vercel build` → `vercel deploy --prebuilt`) so the exact build Vercel runs is reproducible locally.

### One-time setup to enable deployment

You only need to do this once, in your own GitHub + Vercel accounts:

1. Push this repo to GitHub (see below).
2. Create a new project on [vercel.com](https://vercel.com) and import the GitHub repo. Vercel will auto-detect the Vite framework.
3. Generate a Vercel token: **Vercel dashboard → Settings → Tokens**.
4. In your Vercel project, find your **Org ID** and **Project ID** under **Settings → General** (or run `vercel link` locally, which writes `.vercel/project.json`).
5. In your GitHub repo, go to **Settings → Secrets and variables → Actions** and add:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
6. Push to `main` — the `deploy` job builds and publishes automatically. Alternatively, you can let Vercel's own GitHub integration handle deploys and use this workflow purely for CI (lint/typecheck/build) if you'd rather not manage secrets — both are valid.

## Pushing to GitHub

```bash
git init
git add .
git commit -m "Initial commit: job board"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

## Data & persistence

There is no backend. Seed jobs live in `src/data/jobs.ts`. Anything a user does — posting a job, applying, saving a job, or switching themes — is written to `localStorage` under the `board:*` keys, so it persists across reloads on the same browser but isn't shared between users. This is intentional for a self-contained demo; see [FEATURES.md](./FEATURES.md) for notes on what a production version would add.
