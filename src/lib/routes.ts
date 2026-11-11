/**
 * Route registry for the "alen.is/…" command bar.
 *
 * The domain is a wordplay: every slug completes the sentence "alen is <slug>".
 * Only these routes are listed in the command bar — anything else the visitor
 * types is offered as-is: it might be a page, it might not. Finding out is
 * part of the fun.
 */
export interface SiteRoute {
    /** URL segment — also the word that completes "alen is …" */
    slug: string
    /** Short human description shown next to the option */
    description: string
    /** The same line while Ban is in. Falls back to `description`. */
    ban?: string
    /** Loose grouping used for the badge in the results list */
    group: 'work' | 'life' | 'contact'
}

export const SITE_ROUTES: SiteRoute[] = [
    // work
    { slug: 'working', description: "where I've worked", ban: "everyone who's paid me", group: 'work' },
    { slug: 'building', description: "things I've made", ban: 'things I got away with', group: 'work' },

    // life
    { slug: 'listening', description: "what's on loop", ban: 'the same song again', group: 'life' },
    { slug: 'playing', description: 'steam and xbox, with the backlog', ban: "games I've beaten", group: 'life' },
    { slug: 'using', description: "the desk and what's on it", ban: 'what I do it with', group: 'life' },
    { slug: 'cool', description: 'am I cool?', ban: 'not a question', group: 'life' },
    { slug: 'writing', description: 'notes on things I had to figure out', ban: 'statements', group: 'life' },

    // contact
    { slug: 'meeting', description: 'book a call with me', ban: 'you get twenty minutes', group: 'contact' }
]

/** Pages that read as adjectives — their OG card asks "alen is <word>?" (no verdict stamp) */
export const ADJECTIVE_SLUGS = new Set([
    'cool',
    'bi',
    'gay',
    'pan',
    'straight',
    'thinking',
    'angry',
    'mad',
    'human',
    'definitely-human',
    // the OG card spells it out with a space so it reads as a sentence
    'definitely human',
    'alien',
    'evil',
    'ban'
])

/** Professional pages — their OG card declares "alen is <word>!" */
export const PROFESSIONAL_SLUGS = new Set(['working', 'building', 'experience'])

/**
 * Every real top-level page slug, including the ones deliberately left out of
 * the command bar. The OG endpoint uses this to decide between a confident
 * "alen is <word>" and a doubtful "alen is <word>?".
 */
export const ALL_PAGE_SLUGS = new Set([
    ...SITE_ROUTES.map((r) => r.slug),
    'angry',
    'mad',
    'bi',
    'gay',
    'pan',
    'straight',
    'thinking',
    'experience',
    'coding',
    'lifting',
    'lost',
    'sharing',
    'human',
    'definitely-human',
    // the OG card spells it out with a space so it reads as a sentence
    'definitely human',
    'alien',
    'thankful',
    // unlisted: found by typing 'drown' anywhere, or by guessing
    'drowning',
    // unlisted: /evil points at /ban, and /ban is the door to Ban
    'evil',
    'ban'
])
