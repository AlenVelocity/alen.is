import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { FiArrowLeft } from 'react-icons/fi'
import { PageTransition } from '@/components/ui/page-transition'
import { getAllPosts, getPostBySlug, getPostSlugs } from '@/lib/blog'
import { mdxComponents } from '@/components/ui/mdx-components'

export function generateStaticParams() {
    return getPostSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const post = getPostBySlug(slug)
    if (!post) return {}

    return {
        title: post.meta.title,
        description: post.meta.description,
        openGraph: {
            title: post.meta.title,
            description: post.meta.description,
            url: `https://alen.is/blogging/about/${slug}`
        },
        alternates: { canonical: `/blogging/about/${slug}` }
    }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = getPostBySlug(slug)
    if (!post || !post.meta.published) notFound()

    const allPosts = getAllPosts()
    const index = allPosts.findIndex((p) => p.slug === slug)
    const transmissionNumber = String((index >= 0 ? index : allPosts.length) + 1).padStart(3, '0')

    return (
        <PageTransition>
            <div className="container max-w-2xl py-12 md:py-20 px-4">
                <Link
                    href="/blogging"
                    className="inline-flex items-center gap-1.5 mono-label text-muted-foreground/50 hover:text-accent transition-colors mb-10"
                >
                    <FiArrowLeft className="w-3 h-3" />
                    all transmissions
                </Link>

                <p className="mono-label text-muted-foreground/50 mb-4">// transmission_{transmissionNumber}</p>
                <h1 className="text-display text-4xl md:text-5xl mb-4">{post.meta.title}</h1>

                <div className="flex items-center gap-2 mono-label text-muted-foreground/45 mb-12">
                    <span>{format(new Date(post.meta.date), 'MMM d, yyyy')}</span>
                    <span className="text-border">·</span>
                    <span>{post.meta.readingMinutes} min read</span>
                    {post.meta.tags.length > 0 && (
                        <>
                            <span className="text-border">·</span>
                            <span className="text-accent/60">{post.meta.tags.join(', ')}</span>
                        </>
                    )}
                </div>

                <article>
                    <MDXRemote source={post.content} components={mdxComponents} />
                </article>
            </div>
        </PageTransition>
    )
}
