# CLAUDE.md — alen.is

## Project Overview

Personal portfolio/website for Alen Yohannan. Full-stack Next.js app with professional content, personal interest pages, and external API integrations.

**Live site:** alen.is

## Tech Stack

- **Framework:** Next.js 16.1 (App Router) + React 19 + TypeScript (strict)
- **Styling:** Tailwind CSS 3 with CSS variables, shadcn/ui (RSC-enabled), Framer Motion
- **API Layer:** tRPC 11 (end-to-end type-safe) + React Query
- **Database:** PostgreSQL via Prisma 6.5
- **Validation:** Zod
- **Error Handling:** Effect monad pattern (in `src/lib/cms-db.ts`)
- **Analytics:** PostHog + Databuddy SDK
- **Package Manager:** pnpm

## Commands

```bash
pnpm dev              # Dev server (Turbopack)
pnpm build            # Production build
pnpm lint             # ESLint
pnpm format           # Prettier format
pnpm format:check     # Prettier check
pnpm db:push          # Push Prisma schema (no migration)
pnpm db:migrate       # Create Prisma migration
pnpm db:studio        # Prisma Studio GUI
pnpm cms:seed         # Seed CMS data from JSON
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (adjectives)/       # Personality/interest pages
│   ├── (professional)/     # Experience timeline, project portfolio
│   ├── (utils)/            # Coding, lifting, listening, meeting pages
│   ├── api/trpc/           # tRPC API endpoint
│   └── page.tsx            # Home page
├── components/ui/          # shadcn/ui + custom reusable components
├── server/
│   ├── api/routers/        # tRPC routers (poll, lastfm, spotify, gaming, github, fitness)
│   ├── api/root.ts         # Router aggregator
│   └── db.ts               # Prisma singleton
├── trpc/                   # tRPC client setup (react.tsx, server.ts, query-client.ts)
├── lib/                    # Utilities (cn(), cms-db with Effect monad)
├── types/                  # TypeScript interfaces
├── data/                   # Seed JSON (experiences, projects, personal-info, social-links)
└── hooks/                  # Custom hooks (useMobile, useLocalStorage)
```

## Key Patterns

- **Server Components by default.** Use `'use client'` only for interactive features.
- **Route groups** with parentheses: `(adjectives)`, `(professional)`, `(utils)` — organize without affecting URLs.
- **Page-level components** go in `_components/` within the page directory.
- **Data fetching:** Server-side uses Prisma directly via Effect monad; client-side uses tRPC hooks.
- **Provider chain** in root layout: PostHogProvider → TRPCReactProvider → ThemeProvider → Databuddy.
- **Content managed in PostgreSQL** (Experience, Project, PersonalInfo, SocialLink models). Seed data lives in `src/data/`.

## Code Style (Prettier)

- 120 char print width, 4-space indent, single quotes, no semicolons, no trailing commas
- File names: kebab-case. Components: PascalCase. Hooks: `useXxx`.

## Path Alias

`@/*` → `./src/*`

## Database Models

- `BinaryPoll` — yes/no polls (e.g., "am I cool?")
- `Experience` — work history (company, position, period, description[], published)
- `Project` — portfolio items (title, technologies[], featured, published)
- `PersonalInfo` — key-value CMS store (key, value, type: text|json|markdown)
- `SocialLink` — contact/social links (name, url, icon, order)

## External Integrations

Last.fm, Spotify, Steam, Xbox (OpenXBL), GitHub, Cal.com, Discord

## Notes

- `next.config.mjs` ignores ESLint and TypeScript errors during build
- Image optimization configured for AVIF/WebP with remote patterns
- Turbopack + experimental parallel build workers enabled
- Trailing slashes enabled
