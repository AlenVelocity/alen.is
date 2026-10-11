---
name: ui-design
description: Design and build user interfaces that look chosen rather than generated. Use this skill whenever the task involves creating or changing anything a person will see - pages, components, layouts, HUDs and overlays on a canvas or 3D scene, landing pages, forms, menus, empty and error states, or styling of any kind - and whenever the user says a UI looks generic, templated, "AI-generated", or asks to polish, restyle, or redesign something. Use it even for small UI additions, since defaults creep in one component at a time.
---

# UI design

## The problem this skill solves

Generated interfaces fail in a specific way. They are rarely broken or ugly.
They look like the average of every interface the model has seen, so nothing
in them was decided by anyone. People now recognise that average in a few
seconds and read it as carelessness.

A list of banned looks does not fix this. Ban the purple gradient and Inter,
and the output moves to the next most common thing (a cream background with a
serif and a terracotta accent, or near-black with one acid-green accent).
That is the same failure in different clothes.

The fix is to make every visible decision traceable to this product, this
audience, and this screen's job. The rest of this skill is a process for
doing that, plus the craft rules that keep the result solid.

## Step 1: Write the brief

Before any code, state in a few lines:

- **Subject:** what the product is, concretely, and what world it belongs to
  (its materials, vocabulary, references, mood).
- **Audience:** who uses it and in what situation (on a phone on a bus, at a
  desk all day, once out of curiosity).
- **Job:** the one thing this screen must let a person do or understand.
- **Surface type:** marketing page, working tool, or chrome over content
  (a game, canvas, map, video, or 3D scene). These need different amounts of
  design. A tool should be quiet. Chrome should nearly disappear.

If the project has a `DESIGN.md` or existing tokens, read them and follow
them. Consistency with what exists beats a better idea applied to one screen.

## Step 2: Make a design plan

Write the plan down before building. Keep it short.

- **Color:** 4 to 6 named values with a role each (background, surface,
  text, muted text, accent, danger). Say where the accent is allowed to
  appear. An accent used everywhere is no longer an accent.
- **Type:** one or two families and what each is for, plus a scale
  (for example 13 / 15 / 18 / 24 / 36). Pick families for a reason tied to
  the subject, and say the reason.
- **Layout:** the concept in one sentence and a rough ASCII wireframe.
  State alignment (left, centered) and the maximum content width.
- **Signature:** the one element that carries the personality. Everything
  else stays disciplined so this can stand out.

For a new project, save the plan as `DESIGN.md` at the repo root and express
the tokens as CSS variables (or the theme config). Later sessions then
inherit the decisions, which matters more than any single screen.

## Step 3: Check the plan against the defaults

Ask one question: **would this same plan have come out for a different
product?** If yes for any part, that part is a default. Change it and note
what changed and why.

Current defaults to check against. Each is fine when the brief calls for it
and a tell when it shows up unasked:

- Violet, indigo, or purple-to-blue gradients; gradient-filled headline text;
  drifting gradient blobs behind a hero.
- Inter, Geist, Roboto, or system sans for everything. Also the usual
  "escape" picks: Space Grotesk, Plus Jakarta Sans, Instrument Serif.
- Centered hero, then three equal feature cards, then a CTA band.
- A component library left on its stock theme (default grays, default
  radius, default blue buttons).
- Everything in a rounded card with the same radius and the same soft gray
  shadow, regardless of importance.
- Glass blur panels used by reflex.
- Cream background, high-contrast serif, terracotta accent.
- Near-black background with a single neon accent.
- Small uppercase letter-spaced labels above every heading.
- Emoji as icons; icons in tinted rounded squares above each feature title.
- Numbered markers (01, 02, 03) on content that is not a sequence.
- Arrows appended to every link and button.
- Every section fading and sliding up on scroll; hover lift on every card.
- Invented proof: logo strips, "10k+ users", testimonials from made-up
  people, John Doe, lorem ipsum.

## Step 4: Build with these craft rules

These are the floor. They are what makes a design feel finished, whatever
its style.

**Hierarchy.** One primary action per view. Establish importance with size,
weight, and contrast before reaching for color or boxes. If everything is
emphasised, nothing is.

**Spacing.** Use a fixed scale (4, 8, 12, 16, 24, 32, 48, 64). Put more
space between groups than within them, because proximity is what tells
people which things belong together. Prefer spacing and alignment to
borders and cards for grouping. Do not nest cards in cards.

**Typography.** Body text at 15 to 18px with line-height around 1.5;
headings tighter, around 1.1 to 1.25. Keep lines to 45 to 75 characters.
Use two or three weights at most. Use tabular figures for numbers that
change or line up. Sentence case for headings and buttons.

**Color.** Tint neutrals slightly toward the accent hue instead of using
pure gray. Body text contrast at least 4.5:1, large text and UI outlines at
least 3:1. Never signal state with color alone. Design dark mode as its own
palette; inverting the light one gives muddy surfaces and glowing accents.

**Shape and depth.** Scale radius with element size (a small chip and a
large panel should not share one value), and for nested corners use inner
radius = outer radius minus the padding. Shadows mean elevation, so reserve
them for things that float: menus, dialogs, toasts.

**States.** Every interactive element needs hover, focus-visible, active,
and disabled. Every data view needs loading, empty, and error. Generated
UIs usually ship only the happy path, and the gaps are what make a product
feel unfinished. An empty state says what to do next. An error says what
happened and how to fix it.

**Motion.** Animate in response to what the person did, to show what
changed. Keep it between 120 and 250ms with an ease-out curve, and animate
only transform and opacity. At most one unprompted animated moment per page.
Respect `prefers-reduced-motion`.

**Responsive and accessible.** Build the narrow layout first. Touch targets
at least 44px. Nothing may depend on hover. Use semantic elements, real
labels on inputs, and a visible focus ring. Wide content scrolls inside its
own container so the page never scrolls sideways.

## Chrome over content (games, canvas, 3D, maps, media)

When the interface sits on top of something visual, that content is the
design, and the UI's job is to stay out of its way.

- Show as little as possible. Fade out hints once the person has used the
  control. Hide chrome during active interaction and bring it back on pause
  or pointer movement.
- The background is unpredictable, so guarantee legibility: solid or
  near-solid chips, a subtle scrim, or a text shadow. Test against the
  brightest and darkest content the app can produce.
- Take the UI's accent from the content where possible (for example, from
  the current scene's palette) so the chrome feels like part of it.
- Anchor controls to the edges and corners, keep the center clear, and
  respect safe-area insets on phones.
- Make overlay containers ignore pointer events and only the controls
  inside them accept input, so the UI never blocks the scene.
- Entry screens (a single input, a start button) are where the personality
  can go. Give that one screen the signature element.

## Words in the interface

Copy is part of the design, and templated copy makes a custom layout feel
templated. Name things as the user thinks of them, not as the code does.
A button says what will happen ("Copy link", not "Submit"). Keep the same
word for the same thing across the whole flow. Use real content from the
product instead of placeholders. If the `anti-slop-writing` skill is
available, apply it to all UI text.

## Step 5: Review before finishing

- Look at the result if the environment allows: take screenshots at about
  375px and 1280px wide and judge those, not the code.
- Squint test: with the page blurred, is it obvious what matters most?
- Tab through it with the keyboard.
- Re-run the Step 3 question on the built result.
- Remove one thing. There is almost always a decoration, label, or border
  that the design is better without.

When reporting back, say in a line or two which choices were made for this
brief and why, and list anything left unfinished (missing states, untested
widths).
