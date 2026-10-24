import { Metadata } from 'next'
import Link from 'next/link'
import { format } from 'date-fns'
import { PageTransition } from '@/components/ui/page-transition'
import { PageHeader } from '@/components/ui/page-header'
import { EmptyState } from '@/components/ui/empty-state'
import { getAllPosts } from '@/lib/blog'

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
            <div className="container max-w-3xl py-10 md:py-14 px-4">
                <PageHeader eyebrow="things i wrote down" title="Writing">
                    <p className="text-[0.9rem] text-muted-foreground">
                        Written down so I don&apos;t have to figure it out twice.
                    </p>
                </PageHeader>

                {/* Ledger: when on the left, what on the right */}
                {posts.length > 0 ? (
                    <div className="border-t border-dashed border-border/40">
                        {posts.map((post, i) => (
                            <Link
                                key={post.slug}
                                href={`/writing/about/${post.slug}`}
                                className="group grid gap-x-8 gap-y-2 md:grid-cols-[10rem_1fr] py-6 border-b border-dashed border-border/40"
                            >
                                <div className="mono-label tabular-nums md:pt-1 flex md:flex-col gap-x-3 gap-y-0.5 flex-wrap">
                                    <span className="text-muted-foreground/30">{String(i + 1).padStart(3, '0')}</span>
                                    <span className="text-muted-foreground/60">
                                        {format(new Date(post.date), 'MMM d, yyyy')}
                                    </span>
                                    <span className="text-muted-foreground/40">{post.readingMinutes} min read</span>
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-display text-lg mb-1 group-hover:text-accent transition-colors duration-200">
                                        {post.title}
                                    </h2>
                                    <p className="text-[0.875rem] text-muted-foreground leading-relaxed line-clamp-2">
                                        {post.description}
                                    </p>
                                    {post.tags.length > 0 && (
                                        <p className="mono-label text-accent/60 mt-2">{post.tags.join(' · ')}</p>
                                    )}
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
