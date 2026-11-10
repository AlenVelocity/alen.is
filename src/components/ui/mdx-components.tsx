import type { MDXRemoteProps } from 'next-mdx-remote/rsc'
import Link from 'next/link'

type MDXComponents = MDXRemoteProps['components']

/**
 * Renderers for MDX blog content. Everything is styled through the tokens, so
 * a post changes hands with the rest of the site: mono body and Syne headings
 * for Alen, Caslon for Ban.
 *
 * Code is the exception. `font-mono` is always JetBrains Mono, where
 * `font-mono-ui` follows the person, and code set in a serif is not code.
 */
export const mdxComponents: MDXComponents = {
    // The page already has its h1 (the post title), so a `#` in a post is a section
    h1: (props) => <h2 className="text-display text-2xl md:text-3xl mt-12 mb-4 first:mt-0" {...props} />,
    h2: (props) => <h2 className="text-display text-2xl md:text-3xl mt-12 mb-4 first:mt-0" {...props} />,
    h3: (props) => <h3 className="text-display text-xl mt-8 mb-3 first:mt-0" {...props} />,
    p: (props) => <p className="text-[0.95rem] text-muted-foreground leading-relaxed mb-5 break-words" {...props} />,
    a: ({ href, ...props }) => {
        const isInternal = href?.startsWith('/')
        // Underlined at rest so a link can be found in a paragraph. Hover changes colour and nothing else.
        const className =
            'font-medium text-foreground underline decoration-accent/40 decoration-1 underline-offset-4 hover:decoration-accent hover:text-accent transition-colors duration-200'
        return isInternal ? (
            <Link href={href ?? '#'} className={className} {...props} />
        ) : (
            <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...props} />
        )
    },
    ul: (props) => (
        <ul
            className="list-disc pl-5 mb-5 space-y-2 text-muted-foreground marker:text-muted-foreground/50"
            {...props}
        />
    ),
    ol: (props) => (
        <ol
            className="list-decimal pl-5 mb-5 space-y-2 text-muted-foreground marker:text-muted-foreground/60"
            {...props}
        />
    ),
    li: (props) => <li className="text-[0.95rem] leading-relaxed break-words" {...props} />,
    blockquote: (props) => (
        <blockquote
            className="border-l-2 border-border pl-4 mb-5 italic text-muted-foreground [&>p:last-child]:mb-0"
            {...props}
        />
    ),
    code: (props) => (
        <code
            className="font-mono text-[0.85em] px-1 py-0.5 rounded-sm bg-muted text-foreground break-words"
            {...props}
        />
    ),
    pre: (props) => (
        <pre
            className="font-mono text-[0.85rem] leading-relaxed p-4 mb-5 rounded-sm bg-muted/40 border border-border/60 overflow-x-auto [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-[1em]"
            {...props}
        />
    ),
    hr: () => <hr className="border-dashed border-border/50 my-10" />,
    strong: (props) => <strong className="text-foreground font-semibold" {...props} />
}
