# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two kinds of visit (from the October 2026 inventory of the site, not changed since):

- A recruiter or another engineer at a desk with about five minutes, who lands on `/`, `/working` or `/building` and wants to know what Alen has done.
- A friend on a phone who was sent a link to one page (`/alien`, `/bi`, `/drowning`, `/cool`) and wants the joke to land.

## Product Purpose

Alen Yohannan's personal site. It is his CV, his project list, his writing, and a pile of small toy pages. It works when a stranger can read his work history in twenty seconds on a phone, and when every page feels like the same person made it.

## Positioning

- Every address is a sentence: `alen.is/working`, `alen.is/listening`, `alen.is/alien`. Routes are named so the URL reads as a claim about him.
- He says he is a person and is plainly an alien. The site never admits it outright.
- A second person lives on the same site. Ban has the same body and the same CV with the manners removed. He is hidden behind `/ban` and tells the same facts his own way.

## Operating Context

- Content pages are read: home, experience, projects, writing, gear, games, music, code.
- Toy pages are played with once: `/alien`, `/drowning`, `/bi`, `/cool`, `/lost`, the human chain.
- Live data comes from Last.fm, Spotify, Steam, Xbox, GitHub and Cal.com, so pages have loading, empty and error states.
- Light and dark both exist for both people.

## Capabilities and Constraints

- Next.js 16 App Router, React 19, Tailwind 3 with CSS variables, Framer Motion, tRPC, Prisma.
- CMS content sits in a production Postgres database with JSON mirrors in `src/data/`. Design work does not change it.
- Who is in (Alen or Ban) is set on `<html data-persona>` before first paint. Words switch through `<Persona>`, looks through tokens in `globals.css`.
- Metadata and structured data always stay Alen's.

## Brand Commitments

Confirmed by Alen on 22 November 2026:

- The saucer stays: the abduction page change, the saucer in the nav, images beaming in.
- Green stays Alen's colour. The shade can be retuned. No second hue on his side (a pink accent was tried and removed on 11 November 2026).
- Ban keeps his red and his amber.
- The background grid lines go.
- Alen's side should read as alien, not as a terminal or the Matrix.
- The site keeps its personality. A cleaner, more minimal restyle was built and reverted on 14 November 2026 because it "takes away the soul".
- Layout width and typefaces are open to change.

Standing from earlier work:

- Nothing in the nav moves unless the visitor did something.
- No stat chips, counters or HUD readouts.
- Voice: Alen is lowercase, plain and deadpan. Ban is sentence case, blunt and pleased with himself. Everyday words for both, no em dashes.

## Evidence on Hand

- Real work history, projects (with stars and source links), two blog posts, gear list, live listening and gaming data.
- A handwriting signature font (`public/fonts/Better Signature Font`).
- Saucer artwork (`src/components/ui/saucer.tsx`, `public/ufosheens.png`).
- Hand-drawn creature sprites for `/drowning`.

## Product Principles

1. The facts are the same for everyone. Alen and Ban only differ in how they tell them.
2. The professional pages get read first and fast. Personality never costs a recruiter their twenty seconds.
3. One surprise per page, and it answers something the visitor did.
4. The jokes stay.
