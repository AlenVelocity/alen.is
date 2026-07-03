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
    /** Loose grouping used for the badge in the results list */
    group: 'work' | 'life' | 'contact'
}

export const SITE_ROUTES: SiteRoute[] = [
    // work
    { slug: 'working', description: 'experience & work history', group: 'work' },
    { slug: 'building', description: 'projects & things shipped', group: 'work' },

    // life
    { slug: 'listening', description: 'music on loop', group: 'life' },
    { slug: 'playing', description: 'steam & xbox stats', group: 'life' },
    { slug: 'using', description: 'gear & tools', group: 'life' },
    { slug: 'cool', description: 'am I cool?', group: 'life' },

    // contact
    { slug: 'meeting', description: 'book a call with me', group: 'contact' }
]
