import { Metadata } from 'next'
import Link from 'next/link'
import { format } from 'date-fns'
import { FiArrowUpRight } from 'react-icons/fi'
import { PageTransition } from '@/components/ui/page-transition'
import { getAllPosts } from '@/lib/blog'

export const metadata: Metadata = {
    title: 'Writing',
    description:
        'Thoughts, rants and half-finished ideas from Alen Yohannan — writing about software, the web and whatever else was worth sitting down to explain.',
    openGraph: {
        title: 'Alen is Writing',
        description:
            'Thoughts, rants and half-finished ideas from Alen Yohannan — writing about software, the web and whatever else was worth sitting down to explain.',
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
                    <p
                        className="mono-label text-muted-foreground/50 mb-4 animate-fade-in-up opacity-0 stagger-1"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        <span data-nosnippet>// things i wrote down</span>
                    </p>
                    <h1
                        className="text-display text-5xl md:text-6xl mb-3 animate-fade-in-up opacity-0 stagger-2"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        Writing
                    </h1>
                    <p
                        className="text-[0.9rem] text-muted-foreground animate-fade-in-up opacity-0 stagger-3"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        Thoughts and stuff.
                    </p>
                </div>

                {/* Posts */}
                {posts.length > 0 ? (
                    <div className="animate-fade-in-up opacity-0 stagger-4" style={{ animationFillMode: 'forwards' }}>
                        {posts.map((post, i) => (
                            <Link
                                key={post.slug}
                                href={`/writing/about/${post.slug}`}
                                className="group flex items-start gap-4 py-5 border-b border-dashed border-border/50 hover:border-accent/40 transition-all duration-200 scanline-hover"
                            >
                                <span className="mono-label text-muted-foreground/30 w-14 shrink-0 pt-1 group-hover:text-accent/60 transition-colors">
                                    {String(i + 1).padStart(3, '0')}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-display text-lg mb-1 group-hover:text-accent transition-colors duration-200">
                                        {post.title}
                                    </h2>
                                    <p className="text-[0.875rem] text-muted-foreground leading-relaxed mb-2 line-clamp-2">
                                        {post.description}
                                    </p>
                                    <div className="flex items-center gap-2 mono-label text-muted-foreground/40">
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
                                <FiArrowUpRight className="w-4 h-4 text-muted-foreground/25 group-hover:text-accent shrink-0 transition-all duration-200 mt-1.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p
                        className="mono-label text-muted-foreground/40 animate-fade-in-up opacity-0 stagger-4"
                        style={{ animationFillMode: 'forwards' }}
                    >
                        // nothing written yet
                    </p>
                )}
            </div>
        </PageTransition>
    )
}
