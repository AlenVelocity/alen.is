# alen.is design plan

A plan for making the site read as one person's work rather than a template with
an alien skin. Written after an inventory of every route, every component and
`globals.css` (October 2026). Nothing here is applied yet; it is the order of
work and the rules to hold each change against.

## 0. Status (25 October 2026)

Phases 1 to 4 are applied, one commit each, plus the toy-page buttons from
phase 5. Two things were added after the plan, on request:

- **Layouts.** One shared header (`PageHeader`) on every content page, on a
  768px column. Bodies take the shape their content asks for: a ledger with
  dates in a left rail for experience and writing, a two-column grid for
  featured projects, two-line spec rows for gear, a time rail for the
  scrobble list. Home stays a column. The post pages keep the narrower
  reading width.
- **Personality that is not text.** Every image beams in out of glyphs the
  first time it is on screen (`BeamImage`), and the saucer is a recurring
  character: it parks beside the current page in the nav, drops its beam on
  "person" as it turns into "alien", and scans the empty states. Both answer
  something the visitor did, so the motion budget still holds.

What this plan still owes:

- The rebuilt `/coding` page has only been seen in its error state locally
  (the GitHub token does not work on this machine). Check the success
  layout on the deployed site.
- Komorebi's identity bullet is still generic; it needs the product or client
  name. The Extraordinary entry is still a placeholder.
- The console-mode post lost its em dashes by hand, sentence by sentence,
  and nothing else was touched. Read it once; it is your writing.
- `/management` keeps its separate look. The nav's layout spring stays.
- The warp now runs 520ms out and 650ms back. If it still feels long, the
  numbers are the two constants at the top of `ufo-abduction.tsx`.

## 1. Brief

**Subject.** A personal site for a software engineer who insists he is a person
and is clearly an alien. The world is a terminal that has been left running on a
ship: JetBrains Mono for everything that is not a headline, Syne for headlines,
green on near-black, glyph rain, a saucer that abducts the page when you
navigate. The jokes are deadpan and lowercase.

**Audience.** Two kinds of visit. A recruiter or peer at a desk with five
minutes, who lands on `/`, `/working` or `/building`. A friend on a phone who
was sent a link to `/alien`, `/bi` or `/drowning` and wants the joke to land.

**Job.** The professional pages must be readable in twenty seconds on a phone.
The toy pages must deliver one surprise each. The whole site must feel like the
same person built every page.

**Surface types.** Content pages (`/`, `/working`, `/building`, `/writing`,
`/using`, `/playing`, `/listening`, `/coding`) are reading surfaces and should
be quiet. Toy pages (`/alien`, `/drowning`, `/bi`, `/cool`, `/lost`, the
human chain) are where the personality lives and can be loud. Chrome (nav,
command bar, footer) should nearly disappear.

## 2. Why it reads as generated

The site is not ugly and nothing is broken. It reads as generated because the
same decoration is applied to everything, so no decision is visible.

| Pattern | Spread | Problem |
|---|---|---|
| Staggered fade-up entrance | 70 uses in 13 files | Stacks with the UFO drop-in and the page blur-in, so every page has three entrance animations |
| Always-on ambient layers | Every route | Glyph rain, noise pulse, circuit grid, a trailing custom cursor and the warp transition all run at once. The theme becomes wallpaper, and the cursor lag makes the site feel slower than it is |
| `//` eyebrows and labels | About 22 hand-written eyebrows plus 28 auto-prefixed section labels | A comment prefix on every heading stops being a joke |
| Accent glow on hover | About 20 uses in 12 files | When every link glows, the glow carries no information |
| Arrows on links | About 25 in 14 files, nudging diagonally on hover | The arrow-on-everything tell, with motion added |
| Dashed dividers | About 30 in 15 files | Fine as a divider, but they also change color on hover, which adds a second hover response to every row |
| HUD chips and pills | 8 chip rows, 8 pills | Numbers in bordered boxes with icons: the dashboard tell |
| Sci-fi list labels | "active missions", "flight recorder", "human simulation logs", zero-padded `01` | Jargon on lists that are just lists |
| Scanline, decode, blink | `scanline-hover` in 8 places, text decode on 5 pages, 10 blinking cursors | The alien effects compete with each other instead of landing once |
| Off-system pages | `/coding`, `/meeting`, `/management` | Default shadcn look, a `rounded-xl` Cal.com embed in a non-brand green, a SaaS admin |
| Inconsistency | Radius (`rounded-sm` next to `rounded-lg`, `xl`, `2xl`), two icon libraries, three copies of the glyph alphabet and of the spinning repeat border | Reads as assembled, not designed |
| Dead code | 13 unused classes or keyframes, 4 unused shadcn components, `GlyphText`, `getBg`, a `shimmer` animation with no keyframe | Weight without purpose |

The test for every element from here on: would this still be here if the page
were about something else? If yes, and it is decoration, it goes.

## 3. Design plan

### Color

The tokens in `globals.css` stay. What changes is where the accent is allowed.

| Role | Token | Use |
|---|---|---|
| Background | `--background` | Page |
| Surface | `--muted` | Tiles, skeletons, the odd box |
| Text | `--foreground` | Body and headings |
| Muted text | `--muted-foreground` | Meta, labels, descriptions |
| Accent | `--accent` (green) | See the list below, nothing else |
| Danger | `--destructive`, with `yellow-500` and `orange-500` for the middle | Only real status: backlog severity, broken gear |

The accent may appear on: the `//` of the active nav item and of section
labels, link text on hover, the "now" marker and its dot, the one signature
element of a page, and live data (hours this fortnight, a track on repeat). It
may not appear as a glow behind hovered things, on chips, on arrows, or on
borders of boxes that are not interactive.

### Type

Syne for display, JetBrains Mono for everything else. This is the voice of the
site, not a default, and it stays. Scale, in pixels: 11 (`mono-label`), 13,
15 (body), 18, 24, 36, 56. Two label styles only: `section-label` (uppercase,
with the `//`) and `mono-label` (sentence case, no prefix). The
`uppercase tracking-wider` variants on `/listening`, `/coding` and
`/management` go.

### Layout

One column, left aligned, `max-w-2xl`, 16px gutter. A page header is an
eyebrow, a display heading and one sentence. Lists are rows with a dashed
divider. Images get a 4px radius; chips and pills get `rounded-sm`; only things
that float (nav pill, command bar, dialogs, toasts) get `rounded-lg` and a
shadow. The `rounded-xl` playlist frame, the `rounded-2xl` gifs and the
`rounded-lg` album art all move to 4px.

### Signature

Site-wide, the signature is the saucer: the warp on navigation, the Konami
abduction, the beam-up button, and "person" turning into "alien" on the home
page. Those stay as they are. Everything else is in service of making those
land, which means the rest of the chrome goes quiet.

Each page gets at most one signature element of its own (section 5). It is
usually something already there.

## 4. Rules

**Motion budget.** One unprompted animation per page: the page entrance. The
per-element `animate-fade-in-up` staggers come out everywhere except the home
hero. The UFO warp is the entrance for internal navigation; the CSS page-in is
the entrance for direct loads; the two must not both run. The warp keeps its
look but gets shorter (under 600ms) and does not run on back or forward.
Infinite animations are allowed only where they report live state: the
equalizer next to a playing track, the pulse on the current job.

**Ambient layer.** Five things run on every page right now, all at once:
the glyph rain (28 columns, up to 18% alpha, forever), a noise pulse on
`body::before` (an 8 second opacity loop, forever), the circuit grid, the
custom cursor, and the warp. The decisions:

- The custom cursor goes, and the native cursor comes back. What is there now
  is a 10px accent diamond with the strong glow, chasing the pointer at 12% of
  the remaining distance per frame (`ClientLayout.tsx`, `CursorBlob`), which
  is the trailing you see, and it swells to a 26px translucent square over
  links. A custom cursor is the most recognisable agency-template tell on the
  site, and the lag reads as latency. The `custom-cursor` body class, the
  `cursor: none` rule and the `is-hovering` state go with it. If a cursor has
  to stay, it follows the pointer 1:1, with no glow and no size change, but
  the recommendation is none.
- The glyph rain stays as the one ambient layer, at a density where it reads
  as weather rather than a screensaver: 12 columns instead of 28, alpha capped
  at 0.08, speeds halved. It drains out after 30 seconds without pointer or
  scroll activity and restarts on the next move, and it does not draw on a
  hidden tab. It already stops under reduced motion.
- The noise pulse goes. If grain is wanted it is a static layer, not an
  8 second loop.
- The grid stays as it is; it is static.
- The warp is the signature and stays, shorter, as above.
- Toy pages own their effects (particles on `/bi`, the shader on `/alien`,
  the descent on `/drowning`) and are exempt from this budget.

**One hover response per element.** Text links change color. Rows change the
text color of their title. Image tiles get a ring. Nothing translates, scales
or glows on hover. `scanline-hover` stays only on photographs and game art
(the polaroid, the setup photo, the capsule tiles), where it reads as a scan
of the image, and comes off list rows.

**Arrows.** Internal links get none. A link that leaves the site gets a static
`↗` after the text, in the muted color, with no animation. `FiArrowUpRight`
nudges are removed everywhere.

**Labels.** Jokes live in the page eyebrow, one per page, in Alen's voice.
Section labels say what the section is: "recently played", not "active
missions"; "steam library", not "steam archive"; "recent scrobbles", not
"flight recorder". Numbering stays only where order carries meaning (a ranked
list) and loses its zero padding; `001` on the writing index stays, since the
entry number is the joke there.

**Chips and pills.** Icon chip rows become one mono sentence under the heading:
"69 games on Steam, 22 on Xbox. 3,253 hours, which is 136 days." Pills stay only
when they carry state (now, broken, daily driver, primary). Repeat counts and
tags become plain text.

**Dividers and boxes.** Dashed dividers are the one divider style and do not
change on hover. Corner brackets stay only around photographs. Dotted leader
lines stay on `/using` and `/sharing`, where the row is a spec sheet, and come
off project rows.

**States.** Every data view keeps loading, empty and error. Empty states say
what will be there. Errors say what happened, without an exclamation mark.
Every interactive element keeps the visible focus ring.

**Copy.** Section 6. The short version: no em dashes anywhere a reader can
see, no sentence that would fit another engineer's site, lowercase labels, and
the jokes stay.

**Consistency.** One icon library (`react-icons`; swap the lucide import on
`/using`). One glyph alphabet constant shared by the rain, `DecodeText` and
`GlitchPersonWord`. One `RepeatRing` component instead of three copies of the
spinning border. One achievements block on `/playing/[slug]` for both
platforms. The Cal.com embed takes the accent color and a 2px radius.

## 5. Page by page

Keep is the one element that stays loud. Cut and change follow the rules above.

| Page | Keep | Cut | Change |
|---|---|---|---|
| `/` | "person" to "alien", the handwriting signature | Glow and arrows on the social chips, arrows on post rows, 5 of the 7 staggers | Social links become a plain row of mono text links |
| `/working` | The pulsing dot on the current role | Em-dash bullets, resume button glow | Plain list items; keep the durations |
| `/building` | Title decode on hover | Scanline on rows, dotted leaders, arrow nudges | Tech icons stay monochrome at rest; one static `↗` per external row |
| `/writing`, `/writing/about` | `001` numbering, beam-up saucer | Scanline on rows, arrow nudges | Rewrite the 16 em dashes in the console-mode post (content, Alen's call) |
| `/using` | Hover product preview, scanline on the setup photo | Glowing daily-use dot | Pills stay; lucide icon swapped |
| `/playing` | Capsule grid, the backlog meter and its labels | Chip row, tile lift and glow | Chips become one sentence; tiles get a ring on hover; labels become "recently played" and "steam library" |
| `/playing/[slug]` | Header art | Corner brackets, gradient scrim, chip row, zero padding | One achievements block for both platforms |
| `/listening` | Equalizer, sumika dialog, the escalating repeat labels | 3 of the 7 section labels, `×N` pills, `rounded-xl` frame | "flight recorder" becomes "recent scrobbles"; labels lowercase |
| `/listening/to/…` | Spinning ring while on repeat | Full-page color glow, 8 arrows, tilted art, chip row | Links become a short mono list with one `↗` each |
| `/coding` | The contribution graph | Everything else | Rebuilt on the system: eyebrow, display heading, section labels, one error sentence |
| `/meeting` | The embed | Off-brand green, 1rem radius | Accent color and 2px radius |
| `/lifting`, `/thankful`, `/sharing` | Their one line of voice | "Work in Progress" heading | Empty states as a sentence, no blinking cursor |
| `/cool`, `/bi`, `/human` chain, `/alien`, `/drowning`, `/lost` | Everything that makes them toys | Glow and arrows on their CTAs | Nothing else; these pages are the personality |
| `/management` | The job it does | Out of scope for now | Note it uses a separate SaaS look; align later or leave |
| Nav, command bar, footer | The `//` on the active item, the command bar as the index | Blinking `_` in the footer, nav layout spring | Nav pill keeps blur and shadow since it floats |

## 6. Words

The writing standard is `.claude/skills/anti-slop-writing/SKILL.md`, and its
revision pass is the checklist. It applies to everything a reader can see:
UI strings, every page's eyebrow and tagline, section labels, empty and error
states, toasts, the `title` and `description` of all 33 routes, the CMS
content (`personal-info.json`, `experiences.json`, `projects.json`,
`social-links.json`, and their rows in the database), the repeat labels in
`lib/streak.ts`, and both blog posts.

The rules that bite on this site:

- Could the sentence appear unchanged on another engineer's site? Then it
  needs a specific (a number, a name, a user, an outcome) or it goes.
  "Improved code quality through better testing and code review standards"
  fails. "Added phone verification as a fraud signal" passes.
- No em dashes, blog posts included. Replace with a period, a comma or
  parentheses, and rebuild the sentence if the aside was carrying it.
- No promotional adjectives or inflated claims in project descriptions:
  "AI-powered", "superfast", "first ever", "dynamic", "solutions".
- Sentence case for descriptions and labels. Title case only for proper names.
- Errors say what happened, with no exclamation mark. Empty states say what
  will be there.
- Jokes stay. So do the voice markers ("tho", "cause", "iykyk", "(not my
  fault)"); they are Alen's, not a pattern.

What the audit found, with a proposed rewrite where one is safe to propose.
Anything marked "Alen" needs a fact only he has.

| Where | Now | Problem | Proposed |
|---|---|---|---|
| `experiences.json`, Mercor | Six bullets; three are portable ("Improved code quality through better testing and code review standards", "driving product insights", "helped the company make better decisions") | No specifics | Keep four: the platform, the survey system with its user count (Alen), the availability collection, phone verification as a fraud signal |
| `experiences.json`, Komorebi | "Co-founded freelance development company specializing in client projects and developer tools", "Built identity management solutions for enterprise clients", "Led technical architecture and product decisions for client deliverables" | Three bullets that say nothing a reader can picture | Keep Valdle. Name the identity product or client if allowed (Alen). Drop the third |
| `experiences.json`, Frappe | "Made developer experience improvements for Frappe Cloud and Framework users" | Vague | Name one improvement or drop it |
| `experiences.json`, xAGI and EquivoxAI | "a dynamic AI Agent Platform", "methods to streamline fine-tuning of diffusion models on faces" | "dynamic", "streamline" | "an agent platform", "a faster way to fine-tune diffusion models on faces" |
| `experiences.json`, DataEquinox and Synthesized Infinity | "Worked with teams of 7+ people", "Managed dev teams with 10+ people" | Head counts are not work | Drop the first. The second becomes "Ran a community of 10+ contributors across 12 open source projects" |
| `experiences.json`, Extraordinary | "New role, details to follow." | Placeholder | Alen |
| `projects.json`, T2Chat | "Open Source Multi-Model AI Chat Platform" | Title case, portable | "Open source chat app that works with several model providers" |
| `projects.json`, Mercor Work | "AI talent marketplace connecting companies with global talent" | Marketing copy | "Mercor's marketplace for contract work. I built the survey, availability and verification flows" |
| `projects.json`, Infinity | "First ever utility WhatsApp Bot" | Inflated claim | "A utility bot for WhatsApp, from 2020. The project the rest grew out of" |
| `projects.json`, OWCSLE | "Overwatch Championship Series League Esports Arcade Game" | Acronym soup | "Arcade game for the Overwatch Champions Series esports league" |
| `projects.json`, Aureolin | "Superfast TS Web Framework with decorator-based API creation" | "Superfast" | "A TypeScript web framework where routes are decorators" |
| `projects.json`, Gyan.Pro | "AI Voice Note Taking app built with Llama3-8b GROQ" | Reads as a spec | "Voice notes, transcribed and summarised by Llama 3 on Groq" |
| `personal-info.json` | "Currently working on life." and, one paragraph later, "Currently working on my life while playing through my massive backlog" | Said twice | Once, in the second paragraph |
| `/thinking` metadata | "Thinking about stuff, ideas, and random thoughts over here." | Padding | "Alen is thinking. Mostly in excalidraw." |
| `/writing` tagline | "Thoughts and stuff." | Portable | Something that matches the one real post, for example "Written down so I don't have to figure it out twice." (Alen) |
| `lib/streak.ts` | "Heavy Rotation", "Can't Get Enough", "Now Listening" next to "Now playing" | Title case, two forms of the same label | Lowercase throughout, one form |
| `discord-copy.tsx` | "Discord username copied to clipboard!" | Exclamation | "copied" |
| `/coding` error | "GitHub stats unavailable. Check back later!" | Exclamation, no cause | "GitHub isn't answering right now." |
| `/lifting` | "Work in Progress" heading | Generic | Drop the heading; the line under it carries the page |
| `/listening` empty state | "No recently played tracks found." | Capitalised, system voice | "nothing scrobbled lately." |
| Section labels and eyebrows | "active missions", "flight recorder", "steam archive", `01` padding | HUD jargon on plain lists | Section 4, Labels |
| `console-mode-controller-wake.mdx` | 18 em dashes in the body and one in the frontmatter description; "genuinely" twice, "actually" five times | The post itself is specific and plainly human; the dashes are the tell | Rewrite each dash by hand, trim the fillers, change nothing else. A sitting with Alen, since it is his writing |
| `why-does-this-exist.mdx` | "came to me me" | Typo | Fix |

CMS rows live in the database; the JSON is the source of truth for them.
After editing the JSON, apply it with a targeted upsert, not `pnpm cms:seed`,
which wipes every table first.

## 7. Order of work

Each phase ends the same way: screenshots at 375px and 1280px, the squint test,
a tab through with the keyboard, and removing one more thing.

1. **Dead code and consistency.** Delete the 13 unused classes and keyframes,
   the 4 unused shadcn components, `GlyphText`, `GlyphTile`, `getBg`. Fix the
   missing `shimmer` keyframe and the dangling `·` in the drowning depth
   readout. Unify the glyph alphabet, the repeat ring, the icon library and
   the radius scale. No visible change on purpose, so it ships on its own.
2. **The global layer.** The custom cursor removed, the rain thinned and
   given an idle timeout, the noise pulse off, staggers removed, the warp and
   page-in no longer stacking, hover rules applied in `globals.css`. This one
   pass removes most of what reads as generated.
3. **Content pages**, in the order a recruiter sees them: `/`, `/working`,
   `/building`, `/writing`, then `/using`, `/playing`, `/listening` and their
   detail pages, then `/coding` rebuilt.
4. **Words.** Section 6, top to bottom: UI strings and metadata first (no
   facts needed), then the CMS rows (JSON, then upsert), then the two posts
   with Alen, since the experience bullets and the blog rewrites need his
   numbers and his voice.
5. **Toy pages.** Leave the mechanics alone. Align only the CTAs and arrows.

Phases 1 and 2 are a day together and are where the visible change is. Phase 3
is a page or two per sitting. Nothing in this plan removes a joke.
