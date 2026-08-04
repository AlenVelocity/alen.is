import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            // A crawled /management login is just a stray result on the domain,
            // and the tRPC endpoint isn't a page at all. /api/og stays crawlable
            // — it's what renders the card on every shared link.
            disallow: ['/management', '/management/', '/api/trpc/']
        },
        sitemap: 'https://alen.is/sitemap.xml',
        host: 'https://alen.is'
    }
}
