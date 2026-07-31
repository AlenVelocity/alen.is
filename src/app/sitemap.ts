import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'

const baseUrl = 'https://alen.is'

/**
 * trailingSlash is on, so every canonical ends in "/". Listing the bare form
 * here would point the crawler at a 308 for every single URL on the site.
 */
const canonical = (path: string) => `${baseUrl}${path}/`

/**
 * Only canonical, indexable URLs belong here. Deliberately left out:
 *
 *  - /gay, /pan, /straight, /mad, /experience — redirects, not destinations
 *  - /lost, /management — a dead end and the CMS, neither meant for search
 *  - /listening/to/…, /playing/… — generated from live external APIs, so the
 *    set changes hour to hour and would go stale the moment it was written
 */
const PAGES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }[] = [
    { path: '', changeFrequency: 'weekly', priority: 1 },

    // professional
    { path: '/working', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/building', changeFrequency: 'monthly', priority: 0.9 },

    // adjectives
    { path: '/cool', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/bi', changeFrequency: 'yearly', priority: 0.6 },
    { path: '/human', changeFrequency: 'yearly', priority: 0.6 },
    { path: '/definitely-human', changeFrequency: 'yearly', priority: 0.6 },
    { path: '/alien', changeFrequency: 'yearly', priority: 0.6 },
    { path: '/angry', changeFrequency: 'yearly', priority: 0.6 },
    { path: '/thinking', changeFrequency: 'yearly', priority: 0.6 },

    // the rest
    { path: '/writing', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/listening', changeFrequency: 'daily', priority: 0.7 },
    { path: '/playing', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/coding', changeFrequency: 'daily', priority: 0.7 },
    { path: '/using', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/sharing', changeFrequency: 'weekly', priority: 0.5 },
    { path: '/thankful', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/lifting', changeFrequency: 'monthly', priority: 0.4 },
    { path: '/meeting', changeFrequency: 'yearly', priority: 0.7 }
]

export default function sitemap(): MetadataRoute.Sitemap {
    const buildDate = new Date()

    const pages = PAGES.map(({ path, changeFrequency, priority }) => ({
        url: canonical(path),
        lastModified: buildDate,
        changeFrequency,
        priority
    }))

    // Posts carry a real publish date, so they get an honest lastModified
    const posts = getAllPosts().map((post) => ({
        url: canonical(`/writing/about/${post.slug}`),
        lastModified: new Date(post.date),
        changeFrequency: 'yearly' as const,
        priority: 0.8
    }))

    return [...pages, ...posts]
}
