import { format } from 'date-fns'
import { renderBlogOgImage, OG_SIZE } from '@/lib/og'
import { getAllPosts, getPostBySlug, getPostSlugs } from '@/lib/blog'

export const alt = 'alen is blogging'
export const size = OG_SIZE
export const contentType = 'image/png'

export function generateStaticParams() {
    return getPostSlugs().map((slug) => ({ slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = getPostBySlug(slug)

    if (!post) {
        return renderBlogOgImage({
            title: 'signal lost',
            date: '',
            readingMinutes: 1,
            tags: [],
            transmissionNumber: '000'
        })
    }

    const allPosts = getAllPosts()
    const index = allPosts.findIndex((p) => p.slug === slug)
    const transmissionNumber = String((index >= 0 ? index : allPosts.length) + 1).padStart(3, '0')

    return renderBlogOgImage({
        title: post.meta.title,
        date: format(new Date(post.meta.date), 'MMM d, yyyy'),
        readingMinutes: post.meta.readingMinutes,
        tags: post.meta.tags,
        transmissionNumber
    })
}
