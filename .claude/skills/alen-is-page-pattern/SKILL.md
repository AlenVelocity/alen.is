---
name: alen-is-page-pattern
description: Use when creating, renaming, or reviewing a route/page on alen.is, or when touching the blog (/writing). Explains the "alen.is/<segment> reads as a sentence" naming convention this site follows and how metadata should echo it.
---

# alen.is page convention

The domain doubles as the first word of a sentence: `alen.is/<segment>` should read as **"Alen is `<segment>`"**. Almost every route on this site is chosen specifically to complete that sentence, and page metadata (title, OG title) should echo it back.

## Examples already in the codebase

- `/cool`, `/gay`, `/bi`, `/pan`, `/straight`, `/human`, `/alien`, `/definitely-human`, `/thinking` → "Alen is cool / gay / ..." — identity/trait pages, live in the `(adjectives)` route group
- `/working` → "Alen is working" — experience timeline, `(professional)` group
- `/building` → "Alen is building" — project portfolio, `(professional)` group
- `/coding` → "Alen is coding" — GitHub stats, `(utils)` group
- `/lifting`, `/listening`, `/meeting`, `/playing`, `/using`, `/thankful` → "Alen is lifting / listening / ...", `(utils)` group
- `/writing` → "Alen is writing" — blog index, `(utils)` group
- `/writing/about/<slug>` → "Alen is writing about `<slug>`" — blog post detail. This is the one nested case: the sentence extends across two path segments (`about` is the connector) instead of the post being its own top-level route.

Route groups (parenthesized folders like `(adjectives)`, `(professional)`, `(utils)`) organize the codebase only — they don't appear in the URL.

## Rules when adding a new page

1. **Pick the segment so the sentence reads naturally.** Prefer a gerund (`-ing`) or adjective that completes "Alen is ___". If it doesn't read as a real sentence out loud, it's the wrong slug.
2. **Group it correctly**: `(adjectives)` for identity/personality pages, `(professional)` for career-facing pages, `(utils)` for everything else.
3. **Metadata must echo the sentence**, via `constructMetadata()` in [src/lib/metadata.ts](../../../src/lib/metadata.ts):
   ```ts
   export const metadata: Metadata = constructMetadata({
       title: 'Coding',
       description: '...',
       slug: 'coding',
       ogTitle: 'Alen is Coding',
       openGraph: { description: '...' }
   })
   ```
   `ogTitle` should almost always be `Alen is <Segment>` (capitalized naturally, not necessarily title-cased).
4. **New blog posts** live under `src/content/blog/*.mdx` and are served at `/writing/about/<slug>` — no new route needed. **The MDX filename itself is the slug** (`src/lib/blog.ts` reads `<slug>.mdx` and passes the filename straight through as `slug`), so the filename *is* the URL segment that completes "Alen is writing about `<filename>`". Name the file accordingly: kebab-case, reads naturally after "writing about", not just a generic identifier (e.g. `console-mode-controller-wake.mdx` → "Alen is writing about console mode controller wake"). Keep `generateMetadata` in [\[slug\]/page.tsx](<../../../src/app/(utils)/writing/about/[slug]/page.tsx>) producing `title: "writing about ${post.meta.title}"` so the tab title / OG continue the sentence too. The MDX frontmatter `title` can be a normal, full sentence/headline — it doesn't need to fit the pattern on its own, since the filename-driven route + generated title already carry it.
5. Keep slugs kebab-case, lowercase, short — they need to read cleanly inline in a sentence.

Reference implementation: [src/lib/metadata.ts](../../../src/lib/metadata.ts), [src/app/(utils)/writing/page.tsx](<../../../src/app/(utils)/writing/page.tsx>), [src/app/(utils)/writing/about/[slug]/page.tsx](<../../../src/app/(utils)/writing/about/[slug]/page.tsx>).
