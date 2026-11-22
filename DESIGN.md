---
name: alen.is
description: Alen Yohannan's personal site. Two people share it, and each has a light and a dark palette.
colors:
  alen-dark-background: "hsl(172 48% 3.3%)"
  alen-dark-foreground: "hsl(146 30% 89%)"
  alen-dark-card: "hsl(170 40% 6%)"
  alen-dark-muted: "hsl(170 26% 9.5%)"
  alen-dark-muted-foreground: "hsl(156 16% 60%)"
  alen-dark-accent: "hsl(148 96% 66%)"
  alen-dark-border: "hsl(166 26% 13%)"
  alen-dark-destructive: "hsl(0 80% 62%)"
  alen-light-background: "hsl(144 32% 95.5%)"
  alen-light-foreground: "hsl(170 38% 8%)"
  alen-light-card: "hsl(144 26% 92%)"
  alen-light-muted: "hsl(144 18% 88%)"
  alen-light-muted-foreground: "hsl(166 16% 33%)"
  alen-light-accent: "hsl(158 90% 24%)"
  alen-light-border: "hsl(146 18% 80%)"
  alen-light-destructive: "hsl(0 72% 48%)"
  ban-light-background: "hsl(40 38% 90%)"
  ban-light-foreground: "hsl(350 35% 7%)"
  ban-light-card: "hsl(40 30% 86%)"
  ban-light-muted: "hsl(40 20% 82%)"
  ban-light-muted-foreground: "hsl(20 12% 32%)"
  ban-light-accent: "hsl(356 82% 37%)"
  ban-light-signal: "hsl(28 92% 34%)"
  ban-light-border: "hsl(36 20% 70%)"
  ban-light-destructive: "hsl(20 90% 36%)"
  ban-light-redact: "hsl(350 35% 7%)"
  ban-dark-background: "hsl(352 26% 3.8%)"
  ban-dark-foreground: "hsl(36 30% 85%)"
  ban-dark-card: "hsl(352 22% 6.4%)"
  ban-dark-muted: "hsl(352 14% 10%)"
  ban-dark-muted-foreground: "hsl(24 10% 56%)"
  ban-dark-accent: "hsl(356 88% 57%)"
  ban-dark-signal: "hsl(42 94% 58%)"
  ban-dark-border: "hsl(352 14% 14.5%)"
  ban-dark-destructive: "hsl(24 92% 56%)"
  ban-dark-redact: "hsl(356 74% 30%)"
typography:
  display:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "5.25rem"
    fontWeight: 720
    lineHeight: 1.02
    letterSpacing: "-0.028em"
    fontVariation: "'wdth' 88"
  headline:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 720
    lineHeight: 1.02
    letterSpacing: "-0.028em"
    fontVariation: "'wdth' 88"
  title:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 720
    lineHeight: 1.02
    letterSpacing: "-0.028em"
    fontVariation: "'wdth' 88"
  body:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 600
    letterSpacing: "0.16em"
  data:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.7rem"
    letterSpacing: "0.02em"
  nav:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 500
  ban-label:
    fontFamily: "Libre Caslon Text, Georgia, serif"
    fontSize: "0.76rem"
    letterSpacing: "0.01em"
  signature:
    fontFamily: "Better Signature, cursive"
    fontSize: "3.75rem"
    fontWeight: 400
  ban-display:
    fontFamily: "Grenze Gotisch, Times New Roman, serif"
    fontSize: "3.75rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0"
  ban-body:
    fontFamily: "Libre Caslon Text, Georgia, serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
rounded:
  sm: "0.25rem"
  md: "0.4375rem"
  lg: "0.625rem"
  xl: "1rem"
  2xl: "1.5rem"
  full: "9999px"
spacing:
  gutter: "1rem"
  row: "0.875rem"
  header-gap: "2.5rem"
  section-gap: "5rem"
  navbar: "5rem"
components:
  nav-capsule:
    backgroundColor: "{colors.alen-dark-card}"
    textColor: "{colors.alen-dark-muted-foreground}"
    rounded: "{rounded.full}"
    padding: "0.25rem 0.375rem"
  section-label:
    textColor: "{colors.alen-dark-muted-foreground}"
    typography: "{typography.label}"
  membrane-card:
    backgroundColor: "{colors.alen-dark-card}"
    textColor: "{colors.alen-dark-foreground}"
    rounded: "{rounded.xl}"
    padding: "0.875rem"
  text-link:
    textColor: "{colors.alen-dark-foreground}"
  text-link-hover:
    textColor: "{colors.alen-dark-accent}"
  button-bordered:
    textColor: "{colors.alen-dark-muted-foreground}"
    typography: "{typography.data}"
    rounded: "{rounded.sm}"
    padding: "0.625rem 1rem"
  button-bordered-hover:
    textColor: "{colors.alen-dark-accent}"
  button-bordered-accent:
    textColor: "{colors.alen-dark-accent}"
    typography: "{typography.data}"
    rounded: "{rounded.sm}"
    padding: "0.625rem 1rem"
  keycap:
    textColor: "{colors.alen-dark-muted-foreground}"
    typography: "{typography.data}"
    rounded: "{rounded.md}"
    size: "1.35rem"
  ban-stamp:
    textColor: "{colors.ban-light-accent}"
    padding: "0.6em 0.85em 0.5em"
  page-header-title:
    textColor: "{colors.alen-dark-foreground}"
    typography: "{typography.headline}"
---

# Design System: alen.is

## Overview

**Creative North Star: "Bioluminescent"**

Two people share this site, and each has his own world. Alen is the default. His pages sit in deep blue-green water. The green is alive: it is light coming out of things, not ink printed on a screen. There is fine grain over the water, two faint lights in it (one from the surface, one from below), and plankton that drift on a canvas and light up near the pointer. There are no lines and no grid behind the page. He has one green and no second hue.

Ban is behind `/ban` or `?as=ban`. His north star is a charge sheet, printed, stamped and pinned up: a Victorian police notice more than a horror poster. Flat paper, black ink, oxblood red. Nothing glows, there is no saucer and no plankton. His corners are square and his rules are solid.

Both worlds use the same role names, so a component names a role and gets the right look for whoever is in. Each person has a light and a dark palette, which makes four. All of them are in the first block of `src/app/globals.css`. Dark is the default theme.

Confirmed by Alen on 22 November 2026: his side should read as alien, not as a terminal or the Matrix. A cleaner, more minimal restyle was built and reverted on 14 November 2026 because it "takes away the soul". A glossy saucer was rejected as "too shiny".

**Key Characteristics:**
- One green for Alen, used as light: halos, lit rims, the cell mark, plankton.
- One saucer, drawn flat and matte, that lives on the home page and does the page change.
- One typeface for headings and reading text. Monospace only for data.
- Soft edges for Alen, square edges for Ban, both from one `--radius` token.
- One entrance per page. Only live or living things loop.
- The facts are the same for both people. Only the telling and the look change.

## Colors

Four palettes with the same roles. Values are the HSL triplets in `src/app/globals.css`, written here as `hsl(...)`.

### Primary
- **Living green** (`alen-dark-accent`, `alen-light-accent`): Alen's only colour. Link text on hover, the cell mark, the nav underline, the saucer's outline and lights, plankton, focus rings. In the light palette it is dark enough to read as text.
- **Oxblood and arterial red** (`ban-light-accent`, `ban-dark-accent`): Ban's colour. His stamp, the pen stroke through "Alen", the strike-through on titles, the active nav item.

### Secondary
- **Gaslight amber** (`ban-light-signal`, `ban-dark-signal`): Ban only. It marks things happening right now: the dot on the current job, a track that is playing. Alen has no second colour. His `--signal` resolves to his accent.

### Neutral
- **Background** (`*-background`): the page. Deep water for Alen in the dark, pale water at noon in the light. Cheap paper for Ban, dried-blood black in the dark.
- **Foreground** (`*-foreground`): body text and headings. Reading text often sits at 80 to 85 percent of it.
- **Card** (`*-card`): the fill of anything that floats or holds content, at 72 percent opacity inside a membrane. Also the saucer's hull.
- **Muted** (`*-muted`): skeletons, bar tracks, image placeholders.
- **Muted foreground** (`*-muted-foreground`): labels, dates, descriptions, resting nav links.
- **Border** (`*-border`): row dividers, the keycap, bordered buttons.
- **Destructive** (`*-destructive`): real status only, such as broken gear or the "no" answer on `/cool`.
- **Redact** (`ban-light-redact`, `ban-dark-redact`): what Ban's redaction bars are made of. Ink in the light. Red in the dark, because bone bars would flash a dark page white.

### Named Rules
**The one green rule.** Alen has one green and no second hue. A pink accent was tried and removed on 11 November 2026. If something needs to stand out, it gets more light, not another colour.

**The signal rule.** Use `--signal` (`text-signal`, `bg-signal`, `border-signal`) for live state and nothing else. It is the accent for Alen and amber for Ban.

**The light, not ink rule.** Alen's green shows up as glow, a lit edge or a small lit shape. It is not used for rules, grids or printed lines behind the page.

## Typography

**Display Font:** Bricolage Grotesque (with system-ui, sans-serif)
**Body Font:** Bricolage Grotesque (with system-ui, sans-serif)
**Label/Mono Font:** JetBrains Mono (with ui-monospace, monospace), for data only
**Signature Font:** Better Signature (`public/fonts/`), for the handwritten name under the about text and nothing else

**Character:** One variable family does headings and reading text. Headings sit narrow (width 88) and heavy (weight 720) with tight tracking (-0.028em), which is where the face looks least like anyone else's. Ban swaps the lot: Grenze Gotisch blackletter for an `h1`, Libre Caslon Text for everything else, and the root size goes up to 106.25% because a serif reads smaller.

Classes read `--font-display`, `--font-ui` and `--font-data`, never a font directly, so the type changes hands when the person does. The Tailwind names are `font-display`, `font-mono-ui` (the reading face; the name is from when Alen's was a monospace) and `font-data`.

### Hierarchy
- **Display** (720, 3.75rem on a phone, 4.5rem from `sm`, 5.25rem from `lg`, line height 1.02): the home page `h1` only.
- **Headline** (720, 2.25rem, 3rem from `md`, line height 1.02): the title in the shared page header. Ban's is one step larger (3rem, 3.75rem from `md`).
- **Title** (720, 1.125rem to 1.25rem): names inside a page, such as a featured project. Uses `.text-display`.
- **Body** (400, 1rem, line height 1.7, at most 64ch): reading text. The hero sentence is 1.25rem with a snug line height.
- **Label** (600, 0.7rem, 0.16em tracking, uppercase): `.section-label`, the heading of a section, with the cell mark in front.
- **Data** (JetBrains Mono, 0.7rem, 0.02em tracking): `.mono-label`. Dates, counts, durations, keys, typed paths. For Ban it becomes italic Caslon at 0.76rem.

### Named Rules
**The data rule.** Monospace is for things that are measured or typed: dates, counts, keys, code, paths. Reading text and headings are never monospace.

**The masthead rule.** In Ban's mode, blackletter is for an `h1` (or the class `masthead`). Every smaller heading that asks for the display face gets bold Caslon, because blackletter capitals stop being letters below about 30px.

## Layout

One centred column. Content pages use a 48rem column (`max-w-3xl`) with a 1rem gutter. Post pages use a narrower 42rem column (`max-w-2xl`). The page starts 5rem down to clear the fixed nav (`--navbar-height`).

A content page opens with the shared page header, then a body in the shape its content asks for: rows with a divider, a ledger with dates, a grid of covers. On the home page sections are 5rem apart and each starts with a section label. Rows have 0.875rem of padding above and below.

The home hero is the one composed layout. From `md` up the saucer sits at the top right, the hero is as tall as the ship and its beam (25rem, 26rem from `lg`), the text takes 58% of the width, and the five contact links hang in the beam in one column. On a phone the ship hangs above the name and the links run in a row under the text. Ban's hero has no ship: his links are a row at every size.

Breakpoints are Tailwind's defaults (640px, 768px, 1024px). `hover:` styles only apply where there is a real hover (`future.hoverOnlyWhenSupported` in `tailwind.config.ts`), so a tap never leaves a row stuck in its hover colour.

## Elevation & Depth

Alen's depth is light, not lift. The page has two fixed layers behind it: two faint radial lights in the accent (6.5% from the top, 4% from below) and static grain at 5% opacity. Things that float get a membrane: a faint ring of the accent on the inside and one soft shadow underneath. Things that are alive get a glow.

Ban's page is flat. His glow tokens are `none`, his membrane has no shadow, and the lights behind the page are off. He keeps the same faint grain. The one shadow he has is the drop shadow under the command bar.

### Shadow Vocabulary
- **Membrane** (`box-shadow: inset 0 0 0 1px var(--membrane-ring), var(--membrane-shadow)`): the edge of the nav capsule and of cards. The ring is the accent at 14% in the dark and 20% in the light. For Ban the ring is ink at 32% and the shadow is none.
- **Glow** (`--glow-accent`): the nav underline, the word "alien", the scrollbar thumb on hover.
- **Strong glow** (`--glow-accent-strong`): `.glow-text` in the dark, used on toy page headings and the active command bar row.
- **Ship glow** (`drop-shadow(0 0 16px hsl(var(--accent) / 0.42))`): around the saucer.
- **Cell glow** (`0 0 8px hsl(var(--accent) / 0.4)`): around the cell mark.

### Named Rules
**The nothing glows on paper rule.** Ban gets no glow and no soft shadow. If an edge needs to show on his page, rule it in ink.

## Shapes

Alen's edges are soft and Ban's are square, and one token decides it. `--radius` is 0.625rem for Alen and 0 for Ban. Every Tailwind radius is a multiple of it (`sm` 0.4, `md` 0.7, `lg` 1, `xl` 1.6, `2xl` 2.4), so Ban is square at every size without an override. The two exceptions are `rounded-full` and the fixed `rounded`, which need `ban:rounded-none` or the override in `globals.css`.

The nav is a full capsule. Cards use `xl`. Small bordered buttons and bar tracks use `sm`. Dots that mark live state are round for Alen and square for Ban.

Row dividers are written `border-dashed` in markup. CSS turns them into dots for Alen, like something left a trail, and into a solid rule for Ban.

Alen's recurring shape is the cell: a ring with a nucleus. It is his mark on section labels, it is the base of his script, and the saucer's dome and pilot repeat it. Ban's recurring shapes are the rule and the bar: a masthead rule, a strike-through, a redaction bar.

## Components

### Navigation
A fixed capsule at the top centre with a membrane edge and a backdrop blur. It holds three links (home, experience, projects), the theme toggle, and a keycap that opens the command bar. On other pages it shows a breadcrumb with a `/` in the accent between parts. The current page has a 1.5px underline in the accent with a glow, shared between links so it slides to the new one. For Ban the capsule is a ruled box, the underline is a 1px line with no glow, and an `alen` button appears that switches back.

Nothing in the nav moves unless the visitor did something. After scrolling 50px it drops to the home link and the current page and gains a scroll-to-top arrow. Layout moves use one spring (stiffness 500, damping 35).

### Page header
`src/components/ui/page-header.tsx`, on every content page. The title comes first. A small line in the muted colour follows it on the same line and drops under it when there is no room. One sentence goes under, and an optional action sits on the right. Alen's title arrives in his script and turns into English. For Ban the title is his name for the page, the small line holds Alen's title struck out in lower case, and a masthead rule sits over the lot.

### Section label and the cell mark
`.section-label` is a small uppercase label that heads a section. For Alen a cell is drawn in front of it in CSS (`.section-label::before`): a 0.56rem ring with a nucleus, lit from inside. `.cell-mark` is the same shape for use in running text. For Ban the mark is `§` and the label is tracked wider (0.24em).

### Membrane
`.membrane` is the edge of the nav capsule and of cards such as the listening card on the home page. Card fill at 72% opacity, an inset ring, one shadow. For Ban it is a ruled ink box on a near-solid page fill.

### Rows
Lists are rows with a dotted divider (solid for Ban). The row title changes to the accent on hover and nothing else moves. Dates and counts on a row are `.mono-label`.

### Links
- **Inline link** (`src/components/ui/link-button.tsx`): medium weight, a 1px underline in the accent at 40%. On hover the text and underline go full accent.
- **Plain link**: muted or foreground text that changes to the accent on hover, 150ms.
- **External mark** (`src/components/ui/external-mark.tsx`): a link that leaves the site carries a drawn arrow the size of the text. It is never a typed arrow, because a typed one changes shape with the font.
- Icons in one row come from one family. The home page's five links are all Tabler outlines.

### Buttons
The bordered button on the toy pages: `.mono-label` text, 0.625rem by 1rem of padding, a 1px border at 60% of the border colour, the `sm` radius. Hover turns the text to the accent and the border to the accent at 50%. The accent version starts with accent text and an accent border at 40% and fills with the accent at 10% on hover. Pressing scales it to 0.97.

### Keycap
The command bar's trigger is drawn as the key you press: a 1.35rem square `kbd` with a 1px border, the `md` radius and a `/` in the data face.

### Command bar
`src/components/ui/command-bar.tsx`, opened with `/` or Ctrl+K. A membrane panel (radius 1.6 times `--radius`, square for Ban) with a soft accent glow behind it. The fixed prefix `alen.is/`, the query and the results are in the data face. The active row has the accent at 10% behind it and a small accent dot in front. Alen's sentence preview starts with the cell mark. It opens in 160ms and closes in 100ms without moving.

### The saucer
One character with one drawing: `SaucerShip` in `src/components/ui/saucer.tsx`. An outlined hull filled with the card colour, a tinted dome, a pilot, five lights and a soft glow. Flat and matte. The outlines do not scale, so they are the same weight at any size. The small `Saucer` in the same file is its silhouette, for icon sizes (the beam-up button, the empty state).

It is parked in the home hero with its beam on and the contact links hanging in the beam (`src/components/ui/hero-saucer.tsx`). It bobs 6px over 7 seconds and four motes drift up the sides of the beam. When "person" turns into "alien" a light comes up behind it and the beam brightens.

On the home page that same ship does the page change: it lifts off from its spot, and on the way back it lands on it (`ufoFromHero`, `ufoToHero`, `body.ufo-hero-away` in `src/components/ui/ufo-abduction.tsx`). On other pages the ship arrives from off screen. The page change is 340ms out and 440ms back.

**The one saucer rule.** There is one saucer and one drawing of it. It is flat and matte, never glossy, and there is never a second design. A glassy version was rejected by Alen: "too shiny", "looks out of place", and it "doesn't feel right that other UFO is taking this UFO".

### His script and Translate
Sixteen glyphs drawn from a ring, half a ring, a nucleus and a stem (`src/components/ui/alien-script.tsx`). `Translate` (`src/components/ui/translate.tsx`, CSS only, `.xl-*` rules) makes a heading arrive in the script and turn into English word by word, left to right, once. The English is the real text from the start. It is used for the home `h1` and every page header title. On the home page "person" swaps to "alien" on hover or tap, through a blur with a flash of the script (`src/components/ui/glitch-word.tsx`, `.person-word`). His name is also signed in the script under the handwritten signature.

### Plankton
`Plankton` in `src/components/ui/alien-ambience.tsx`. Between 22 and 64 motes drift slowly upward on one canvas. Motes within 150px of the pointer light up and fade over about 900ms. Nothing follows the pointer. The loop stops after 30 idle seconds and on a hidden tab. Alen only.

### Image reveal
`src/components/ui/beam-image.tsx`, once per image. Alen: the picture is beamed down behind a soft edge with one line of light riding it, 650ms. Ban: a bar is pulled off it sideways, 460ms.

### Empty state
`src/components/ui/empty-state.tsx`. Alen: the small saucer hovers over the spot with a beam, above one line in the data face. Ban: a blank ruled line, the way an empty entry is left on a form.

### Ban's masthead, pen stroke and stamp (provisional)
Alen has not seen these three yet, and the stamp's words are the builder's.
- **Masthead rule**: a 3px rule over a 1px rule above the title on every page (`.hero::before`, `.page-header::before`).
- **Pen stroke**: on the home page "Alen" is crossed out with a drawn stroke in his red, heavier where it starts, drawn across in 280ms (`.struck-drawn`). Smaller titles get the tidy line-through (`.struck`).
- **Stamp**: a rubber stamp reading "Not sorry" comes down on the corner of the home masthead (`src/components/ui/ban-stamp.tsx`, `.ban-stamp`). Double border, uppercase, rotated 8 degrees, rough edges and patchy ink from an SVG filter. It lands in 140ms and stops dead.

His page change is redaction bars drawn across the page and pulled off the new one (290ms on, 420ms off). Changing person is a hard diagonal cut across the page (620ms).

### Motion grammar
- Things arrive on `--ease-out` and move on screen on `--ease-in-out`. Tailwind's `ease-out` and `ease-in-out` classes map to them.
- One entrance per page: the page fade (320ms, 8px) on a direct load, or the saucer's beam or Ban's redaction after a navigation in the site. Streamed sections resolve with `StreamFade` (300ms).
- Only live or living things loop: the ship's bob, the motes, the plankton, the equalizer while a track plays, the beacon on the current job.
- Nothing types itself in and nothing has a blinking cursor, the toy pages included. A small line that turns up after the page has (a status on `/alien`, the late caption on `/bi`, the current page's name in the nav) surfaces out of a blur in 260ms (`.surface-in`, `.crumb-in`), or arrives in his script through `Translate`.
- Press feedback is a `scale` between 0.94 and 0.99: smaller targets shrink more.
- Reduced motion collapses everything to its end state. The plankton draw one still frame.

## Do's and Don'ts

### Do:
- **Do** name a role (`bg-card`, `text-accent`, `border-border`) and let the palette decide the value. Write a new green as `hsl(var(--accent) / …)`.
- **Do** use `.membrane` for the edge of anything that floats or holds content.
- **Do** write dividers as `border-dashed` so they come out dotted for Alen and solid for Ban.
- **Do** build radius from the Tailwind scale so Ban stays square. Add `ban:rounded-none` to `rounded-full` and `rounded`.
- **Do** put dates, counts, keys and paths in `font-data` or `.mono-label`.
- **Do** use `Translate` for a page's title and `PageHeader` for its header.
- **Do** mark a link that leaves the site with `ExternalMark`.
- **Do** keep icons in one row from one family.
- **Do** give every data view a loading, an empty and an error state, and keep the visible focus ring (1px, 2px offset).

### Don't:
- **Don't** add a second hue to Alen's side. The pink was removed.
- **Don't** draw a grid, rules or lines behind Alen's pages.
- **Don't** make the saucer glossy or glassy, and don't draw a second design of it. Alen's words for the glossy one: "too shiny", "looks out of place".
- **Don't** set reading text or headings in monospace. Alen's side should not read as a terminal.
- **Don't** give Ban a glow, a soft shadow, a saucer or plankton.
- **Don't** move anything in the nav unless the visitor did something.
- **Don't** add stat chips, counters or HUD readouts.
- **Don't** type an arrow after a link.
- **Don't** loop an animation that is not reporting something live or alive.
- **Don't** strip the personality for a cleaner look. That was built and reverted.

## Two people

The site has a second person on it. Alen is the default. **Ban** is the other
one: same body, same CV, opposite manners. Think Jekyll and Hyde. He is hidden.
Nothing in Alen's site links to him except `/evil`, which nobody links to
either.

### How it works

- Who is in lives in `localStorage` (`alen-persona`) and on
  `<html data-persona="alen|ban">`, set before first paint by an inline script
  in `<head>` (`src/lib/persona.ts`). No cookie, no server read, so every page
  stays static.
- The door is `/ban` ("Alen is Ban"). `?as=ban` and `?as=alen` on any URL also switch, then
  remove themselves from the address bar. While Ban is in, the nav grows an
  `alen` button that switches back.
- The switch itself is a view transition: the new person's page is cut in
  across the old one on a diagonal (`switchPersona` in `src/lib/persona.ts`).
- Light and dark still work for both people. That makes four palettes, all in
  the first block of `src/app/globals.css`, all using the same role names.

### Writing a page for two people

```tsx
import { Persona, OnlyAlen, OnlyBan } from '@/components/persona'

<p><Persona alen="Where I've worked, newest first." ban="Everyone who has paid me. They got their money's worth." /></p>
```

`<Persona>` renders both versions and CSS shows one. It works in server and
client components and never flashes. Rules:

- **Words go through `<Persona>`.** Behaviour goes through `usePersona()`
  (`src/hooks/use-persona.ts`, client only) or `getPersona()` at event time.
  Never render words from the hook: the server always says "alen" and the
  text would flash.
- The wrappers are `display: contents`. Put `<Persona>` **inside** the element
  being laid out (`<p><Persona … /></p>`), not around it, or the parent's
  `space-y-*`, `first:` and `last:` rules stop working. Pass `as="div"` when
  the content is block level.
- `ban:` and `alen:` are Tailwind variants for per-person styling on one
  element: `text-left ban:text-center`.
- `PageHeader` takes `banTitle`. While Ban is in, his title replaces Alen's and
  Alen's sits after it on the same line, struck out. That strike-through (class
  `struck`) is Ban's mark, the way the cell is Alen's. Use it for titles and
  nowhere else. On the home page the same mark is drawn by hand
  (`struck-drawn`).
- CMS content: `asBanExperiences`, `asBanProjects`, `asBanPersonalInfo` in
  `src/lib/ban-content.ts` lay Ban's overlay (`src/data/ban/*.json`, keyed by
  id) over Alen's rows. Ban only overrides the telling, never the facts.
- Metadata (`title`, `description`, OG) stays Alen's. Crawlers and link
  previews never meet Ban. The tab title is corrected in the browser.

### Ban, the brief

**Subject.** The same engineer with the politeness removed. Where Alen's site
is deep water with something glowing in it, Ban's is a charge sheet: something
printed, stamped and pinned up. The reference is a Victorian police notice
more than a horror poster.

| | Alen | Ban |
|---|---|---|
| World | deep water, lit from inside | charge sheet, printed |
| Accent | living green | oxblood on paper, arterial red in the dark |
| Signal ("live") | the accent | gaslight amber |
| Display type | Bricolage Grotesque, narrow and heavy | Grenze Gotisch (blackletter), `h1` only |
| Body type | Bricolage Grotesque | Libre Caslon Text, root size up 6% |
| Data | JetBrains Mono | italic Caslon marginalia |
| Labels | the cell, uppercase | `§`, uppercase |
| Rules | dotted | solid |
| Corners | soft | square |
| Glow | on the accent | none, nothing glows on paper |
| Ambient | plankton, two faint lights, grain | none: a flat page with the same faint grain |
| Home hero | the saucer, with the links in its beam | a masthead rule, a pen stroke and a stamp |
| Page change | saucer abducts the page | the page is redacted, bars on then off |
| Image reveal | beamed down, soft, vertical | uncensored, hard, sideways |
| Selecting text | green highlight | solid ink, a redaction |
| Mark | the cell | ~~strike-through~~ |

Blackletter capitals stop being letters below about 30px, so in Ban's mode
`.text-display` is blackletter only on an `h1` (or with the class `masthead`)
and bold Caslon everywhere else. One capital is weak at any size: the
blackletter "I" can read as a "D" or a "J". Ban talks in the first person, so
prefer an `h1` that does not open with "I" when another line is as good (his
hero is "~~Alen~~ Ban."). It is a preference, not a rule: `/cool` says "I am
cool." because Alen chose it over the alternative. Body text is Caslon and can
start however it likes.

Most of this is carried by tokens and a block of overrides under `BAN` in
`src/app/globals.css`, so a page gets Ban's look without being touched. What a
page owes him is his words.

### The two voices

**Alen.** First person, plain, a little self-deprecating. Lowercase labels and
title lines. Says what the thing is, then stops. Jokes are deadpan and short,
and he keeps his own markers ("tho", "cause", "iykyk"). He never sells. A
sentence of his names something real: a product, a number, a year.

**Ban.** First person, sentence case, full stops. Short declaratives. He takes
the credit, blames the hardware, never apologises and never asks. He does not
use "tho". He is contemptuous of Alen ("he", never by flattering name) and
pleased with himself.

The joke is the framing. The facts do not change. Every employer, date, product
and number on Ban's pages is the true one from Alen's. "Built the survey system
that thousands of contractors filled in" becomes "Made thousands of contractors
fill in a survey." Rules for him:

- His villainy is petty and domestic: pushing to main on a Friday, reading the
  docs and telling no one, finishing your sentences. Never actual harm.
- He never insults an employer, a client, a colleague, the reader, or any group
  of people. He is rude about Alen and about things (a broken IEM, a backlog).
  This is still a real person's CV and a recruiter may read it in this mode.
- No horror vocabulary (blood, souls, darkness, doom). He is a man who does not
  return the shopping cart, not a demon.
- Same anti-slop rules as everything else, same ban on em dashes.
- Everyday words, for both of them. Ban is blunt, not fancy: "Weapons", not
  "Arsenal"; "on purpose", not "premeditated". He uses contractions like
  anyone else ("I don't", "it's"). If a word would make a reader stop and
  look it up, pick the plainer one.

### What Ban calls the pages

| Route | Alen | Ban |
|---|---|---|
| `/` nav label | alen.is | ban.is |
| `/working` | Experience | Record |
| `/building` | Projects | Schemes |
| `/using` | Gear | Weapons |
| `/listening` | Listening | Noise |
| `/playing` | Playing | Wins |
| `/writing` | Writing | Statements |
| `/coding` | Coding | Proof |
| `/meeting` | Meeting | A word |
| `/sharing` | Sharing | Loot |
| `/lifting` | Lifting | Training |
| `/thankful` | Thankful | Debts |

### Adjective pages answer differently

`alen.is/<word>` is a claim, and the two of them disagree about most of them.
`/evil`: Alen says no, Ban says obviously. `/ban` ("Alen is Ban"): Alen says
not right now and asks you not to press the button; once Ban is in, the same
page says he is now, and offers the way back.
`/cool`, `/human`, `/angry` and the rest get a second answer the same way: one
`<Persona>` around the verdict, the mechanics untouched.

`/drowning` is the one where the mechanics change. Ban doesn't drown: while he
is in, nothing sinks and nothing swims up, the page is one still screen ("He
drowns. Not me."), and the tab keeps saying "Alen is drowning". Letting Alen
back in from the nav starts the dive.

`/lost` (Conway's Game of Life) has no grid lines on its board. Alen's cells
are round, like a colony of something alive; Ban's are square.

## Words

The writing standard is `.claude/skills/anti-slop-writing/SKILL.md`, and its
revision pass is the checklist. It applies to everything a reader can see:
UI strings, every page's title line and tagline, section labels, empty and
error states, toasts, the `title` and `description` of every route, the CMS
content (`personal-info.json`, `experiences.json`, `projects.json`,
`social-links.json` in `src/data/`, and their rows in the database), the repeat
labels in `src/lib/streak.ts`, and both blog posts.

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

CMS rows live in the database; the JSON is the source of truth for them.
After editing the JSON, apply it with a targeted upsert, not `pnpm cms:seed`,
which wipes every table first.
