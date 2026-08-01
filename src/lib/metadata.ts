import { Metadata } from 'next'

interface MetadataProps {
    title: string
    description: string
    /** URL segment, e.g. "building". Used to generate canonical URL and OG image */
    slug?: string
    /** Overrides the title used in openGraph. Defaults to `title` */
    ogTitle?: string
    /** Overrides the auto-generated OG image */
    image?: string
    /** Additional openGraph properties to merge */
    openGraph?: Partial<Metadata['openGraph']>
    /** Disable canonical URL generation */
    noCanonical?: boolean
}

/**
 * Standardizes metadata generation across the site, automatically wiring up
 * the dynamic OG image generator and canonical URLs based on the slug.
 */
export function constructMetadata({
    title,
    description,
    slug,
    ogTitle,
    image,
    openGraph,
    noCanonical
}: MetadataProps): Metadata {
    const canonical = noCanonical ? undefined : `/${slug || ''}`
    const finalOgTitle = ogTitle || title
    const finalImage = image || (slug ? `/api/og?is=${slug}` : '/opengraph-image')

    return {
        title,
        description,
        openGraph: {
            title: finalOgTitle,
            description,
            ...(slug && { url: `https://alen.is/${slug}` }),
            images: [
                {
                    url: finalImage,
                    width: 1200,
                    height: 630,
                    alt: finalOgTitle
                }
            ],
            ...openGraph
        },
        ...(canonical && { alternates: { canonical } })
    }
}
