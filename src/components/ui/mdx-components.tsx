import type { MDXRemoteProps } from 'next-mdx-remote/rsc'
import Link from 'next/link'

type MDXComponents = MDXRemoteProps['components']

/** Styled renderers for MDX blog content — keeps posts on the site's mono/display type system. */
export const mdxComponents: MDXComponents = {
    h1: (props) => <h2 className="text-display text-2xl md:text-3xl mt-12 mb-4 first:mt-0" {...props} />,
    h2: (props) => <h2 className="text-display text-2xl md:text-3xl mt-12 mb-4 first:mt-0" {...props} />,
    h3: (props) => <h3 className="text-display text-xl mt-8 mb-3" {...props} />,
    p: (props) => <p className="text-[0.95rem] text-muted-foreground leading-relaxed mb-5" {...props} />,
    a: ({ href, ...props }) => {
        const isInternal = href?.startsWith('/')
        const className = 'text-foreground font-medium link-alien'
        return isInternal ? (
            <Link href={href ?? '#'} className={className} {...props} />
        ) : (
            <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...props} />
        )
    },
    ul: (props) => (
        <ul className="list-disc pl-5 mb-5 space-y-2 text-muted-foreground marker:text-accent/50" {...props} />
    ),
    ol: (props) => (
        <ol className="list-decimal pl-5 mb-5 space-y-2 text-muted-foreground marker:text-accent/60" {...props} />
    ),
    li: (props) => <li className="text-[0.95rem] leading-relaxed" {...props} />,
    blockquote: (props) => (
        <blockquote className="border-l-2 border-accent/40 pl-4 mb-5 italic text-muted-foreground/90" {...props} />
    ),
    code: (props) => (
        <code
            className="font-mono-ui text-[0.85em] px-1.5 py-0.5 rounded-sm bg-muted/60 border border-border/50 text-accent"
            {...props}
        />
    ),
    pre: (props) => (
        <pre
            className="font-mono-ui text-[0.85rem] p-4 mb-5 rounded-sm bg-muted/40 border border-border/60 overflow-x-auto [&>code]:bg-transparent [&>code]:border-0 [&>code]:p-0 [&>code]:text-foreground"
            {...props}
        />
    ),
    hr: () => <hr className="border-dashed border-border/50 my-10" />,
    strong: (props) => <strong className="text-foreground font-semibold" {...props} />
}
