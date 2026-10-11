---
name: anti-slop-writing
description: Write and edit prose so it reads as written by a person who knows the subject, with none of the patterns readers recognise as AI-generated. Use this skill whenever producing or revising any text a human will read - README files, docs, landing page and UI copy, error messages, blog posts, announcements, emails, commit messages, PR descriptions, code comments, changelogs - and whenever the user says text sounds like AI, sounds generic, is "slop", or asks to humanize, tighten, or rewrite something. Use it even when the user did not ask for good writing, since they always want it.
---

# Anti-slop writing

## What slop is

Readers have learned to spot machine-written text, and once they spot it
they stop reading charitably. The surface signs (certain words, certain
punctuation) are symptoms. The cause is text produced without a decision
behind it: sentences that would fit any subject, emphasis with nothing
specific underneath, structure applied because it is common.

So this skill has two halves. The first is about having something to say.
The second is a catalog of patterns to remove. Doing only the second gives
you empty text that is harder to detect, which is worse, so do them in
order.

## Before writing

Answer three questions. If you cannot, find out or ask.

1. **Who is reading, and what do they already know?**
2. **What should they know or be able to do afterwards?**
3. **What specifics do you actually have?** Names, numbers, versions,
   commands, examples, reasons, limits.

Then write only what serves question 2, using the material from question 3.

The test for any sentence: **could it appear unchanged in a text about a
different subject?** "A powerful tool that streamlines your workflow" can.
"Hashes any text into a seed and builds a 3D world from it" cannot. Replace
portable sentences with specific ones. If you have no specific to replace
it with, delete the sentence. A shorter text is the correct result.

## Patterns to remove

### Empty content

- **Inflated significance.** Claims that something is pivotal, a testament,
  a milestone, or part of a broader shift. State what it does and let the
  reader judge.
- **Promotional adjectives.** Powerful, seamless, robust, cutting-edge,
  blazing fast, elegant, rich, vibrant, comprehensive. Give the fact that
  would justify the adjective (the benchmark, the supported cases).
- **Vague authority.** "Experts say", "widely regarded", "many developers
  find". Name the source or drop the claim.
- **Tidy endings.** A closing sentence or section that restates the point,
  draws a moral, or looks to the future ("Ultimately...", "In summary...",
  "The future looks bright"). Stop when the content stops.
- **Commentary on the text.** "It's worth noting", "It's important to
  remember", "Let's dive in", "Here's the thing", "Here's what you need to
  know". Say the thing.
- **Stacked hedges.** "Can potentially", "may help to", "generally tends
  to". Hedge once, where the uncertainty is real, and say what it is.

### Formulaic structure

- **Denying something nobody claimed** to set up the real point: "It's not
  just X, it's Y", "This isn't about X. It's about Y", "No fluff, just Z".
  State Y.
- **Groups of three** used for rhythm: three adjectives, three short
  fragments, three parallel clauses. Use the number of items there are.
- **Staged reveals.** A question or a colon placed to build suspense before
  an ordinary point ("The result? Chaos." "The catch: it's slow."). Write
  it as a plain sentence.
- **Punchline paragraphs.** Every paragraph ending on a short quotable
  line. Vary how paragraphs end, and let most end on information.
- **Uniform rhythm.** Sentences all the same length, or a mechanical
  long-long-short pattern. Read it through and break the pattern where it
  shows.
- **Mirror-image sentences.** "The more X, the more Y", "Less about X, more
  about Y", repeated as a device.
- **Signposted transitions.** Moreover, furthermore, additionally, that
  said, in essence, in today's world. If two sentences connect, order does
  the work.

### Vocabulary

These words appear far more often in generated text than in human writing.
Each has a plain replacement or needs none:

delve, tapestry, landscape (figurative), realm, journey (figurative),
testament, pivotal, crucial, vital, intricate, nuanced, multifaceted,
foster, leverage, harness, unlock, empower, elevate, streamline, navigate
(figurative), underscore, highlight (as a verb), showcase, boast, embark,
seamless, robust, vibrant, meticulous, ever-evolving, game-changer,
truly, really, simply, just, honestly, essentially, fundamentally.

### Formatting

- **Em dashes.** The most recognised single tell. Do not use them. Rewrite
  with a full stop, a comma, or parentheses.
- **Scattered bold.** Bold on phrases through a paragraph. Reserve bold for
  the one thing a skimming reader must not miss, or for term labels.
- **Bullets with bold lead-ins** on content that is really a paragraph.
  Use a list when the items are parallel and separate. Otherwise write
  sentences.
- **Headers on short text.** A three-paragraph answer needs none.
- **Title Case Headings.** Use sentence case.
- **Emoji** as bullets, in headings, or in commit messages and READMEs.
- **Curly quotes and decorative arrows** in technical text.

### Chat residue

Text meant for a document, repo, or UI must not carry conversation with it:
"Great question", "Certainly!", "Here's the updated version", "I hope this
helps", "Let me know if you'd like changes", or notes about what was
changed. Deliver the text alone.

## The substitution trap

Removing a pattern by swapping in its nearest relative leaves the same
sentence shape, and readers still recognise it.

- Em dash replaced by a semicolon or " - ": same aside, same tell.
- "It's not X, it's Y" replaced by "Rather than X, it's Y": same move.
- "Delve into" replaced by "dig into": same filler.
- "Moreover" replaced by "On top of that": same signpost.

When you catch a pattern, rebuild the sentence around what it says. Often
the sentence turns out to say nothing, and the fix is to cut it.

## By context

- **README and docs.** Open with what the thing is and does, in one or two
  plain sentences, then how to run it. No tagline, no feature list of
  adjectives, no emoji section headers. Show a command or example early.
  Document limits and known problems, because a human author would.
- **Landing and UI copy.** Describe what it does in the user's words. Short
  is good, cute is risky. Buttons name the action. Errors say what happened
  and what to do next, with no apology and no exclamation mark.
- **Commit messages and PR descriptions.** Imperative summary under about
  70 characters, then why the change was needed if it is not obvious. No
  emoji, no "This commit...", no restating the diff, no list of virtues
  ("improves readability and maintainability").
- **Code comments.** Explain why, not what the next line does. No comments
  that narrate the edit ("Updated to use new API", "Fixed bug here").
- **Posts and announcements.** Lead with the news. Write as one person
  telling another what they made and what is interesting about it. An
  honest rough edge ("the mobile controls are still clumsy") earns more
  trust than polish.

## Do not overcorrect

The aim is clear writing, and disguise is a different goal. Do not add
typos, forced slang, or fake casualness. Do not cut a technical term
because it sounds formal. Do not avoid a list when the content is a list,
or a word from the vocabulary section when it is the literal, correct word
(a "robust" statistical estimator, "navigate" in a routing library).

## Revision pass

After drafting, reread once for each of these and fix what you find:

1. **Portable sentences.** Apply the different-subject test. Replace or cut.
2. **Structure patterns.** Denials, triples, reveals, punchlines, tidy
   ending.
3. **Vocabulary and formatting.** Search the draft for em dashes and the
   listed words.
4. **Substitutions.** Check that step 2 and 3 fixes changed the sentence
   and did not only change its surface.
5. **Read it as the reader.** Would they miss anything if a given sentence
   were gone? If no, remove it.

## Example

Before:

> 🚀 **Wordworld** is a powerful, cutting-edge web experience that
> transforms the way you explore — turning any word into a rich, immersive
> 3D world. It's not just a toy; it's a journey into infinite possibility.
> Whether you're a developer, a designer, or simply curious, Wordworld
> empowers you to discover, create, and share. Dive in today!

After:

> Wordworld turns any text into a small 3D world you can walk around in.
> The same text always gives the same world, so every world is a link you
> can share. Try your own name first.

The second version is shorter because the first contained three facts and
the rest was decoration. That ratio is typical.
