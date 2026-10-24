import { Metadata } from 'next'
import Link from 'next/link'
import { format } from 'date-fns'
import { PageTransition } from '@/components/ui/page-transition'
import { DecodeText } from '@/components/ui/decode-text'
import { getAllPosts } from '@/lib/blog'
import { EmptyState } from '@/components/ui/empty-state'

export const metadata: Metadata = {
    title: 'Writing',
    description: 'Posts about things I built, and what went wrong on the way.',
    openGraph: {
        title: 'Alen is Writing',
        description: 'Posts about things I built, and what went wrong on the way.',
        images: [{ url: '/api/og?is=writing', width: 1200, height: 630, alt: 'alen is writing' }]
    },
    alternates: { canonical: '/writing' }
}

export default function Writing() {
    const posts = getAllPosts()

    return (
        <PageTransition>
            <div className="container max-w-2xl py-12 md:py-20 px-4">
                {/* Header */}
                <div className="mb-16">
                    <p className="mono-label text-muted-foreground/50 mb-4">// things i wrote down</p>
                    <h1 className="text-display text-5xl md:text-6xl mb-3">
                        <DecodeText text="Writing" onMount />
                    </h1>
                    <p className="text-[0.9rem] text-muted-foreground">
                        Written down so I don&apos;t have to figure it out twice.
                    </p>
                </div>

                {/* Posts */}
                {posts.length > 0 ? (
                    <div>
                        {posts.map((post, i) => (
                            <Link
                                key={post.slug}
                                href={`/writing/about/${post.slug}`}
                                className="group flex items-start gap-4 py-5 border-b border-dashed border-border/50"
                            >
                                <span className="mono-label text-muted-foreground/30 w-14 shrink-0 pt-1 tabular-nums">
                                    {String(i + 1).padStart(3, '0')}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-display text-lg mb-1 group-hover:text-accent transition-colors duration-200">
                                        {post.title}
                                    </h2>
                                    <p className="text-[0.875rem] text-muted-foreground leading-relaxed mb-2 line-clamp-2">
                                        {post.description}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mono-label text-muted-foreground/40">
                                        <span>{format(new Date(post.date), 'MMM d, yyyy')}</span>
                                        <span className="text-border">·</span>
                                        <span>{post.readingMinutes} min read</span>
                                        {post.tags.length > 0 && (
                                            <>
                                                <span className="text-border">·</span>
                                                <span className="text-accent/60">{post.tags.join(', ')}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <EmptyState>nothing written yet</EmptyState>
                )}
            </div>
        </PageTransition>
    )
}
