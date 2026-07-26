import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const BLOG_DIR = join(process.cwd(), 'src/content/blog')

export interface PostMeta {
    slug: string
    title: string
    description: string
    date: string
    tags: string[]
    published: boolean
    readingMinutes: number
}

interface Frontmatter {
    title: string
    description: string
    date: string
    tags?: string[]
    published?: boolean
}

function readPostFile(slug: string) {
    const raw = readFileSync(join(BLOG_DIR, `${slug}.mdx`), 'utf8')
    return matter(raw)
}

function toMeta(slug: string, data: Frontmatter, content: string): PostMeta {
    return {
        slug,
        title: data.title,
        description: data.description,
        date: data.date,
        tags: data.tags ?? [],
        published: data.published ?? true,
        readingMinutes: Math.max(1, Math.round(readingTime(content).minutes))
    }
}

/** All published posts, newest first. Used by the /blogging index. */
export function getAllPosts(): PostMeta[] {
    const slugs = readdirSync(BLOG_DIR)
        .filter((file) => file.endsWith('.mdx'))
        .map((file) => file.replace(/\.mdx$/, ''))

    return slugs
        .map((slug) => {
            const { data, content } = readPostFile(slug)
            return toMeta(slug, data as Frontmatter, content)
        })
        .filter((post) => post.published)
        .sort((a, b) => (a.date < b.date ? 1 : -1))
}

/** Every slug on disk, published or not — used for generateStaticParams. */
export function getPostSlugs(): string[] {
    return readdirSync(BLOG_DIR)
        .filter((file) => file.endsWith('.mdx'))
        .map((file) => file.replace(/\.mdx$/, ''))
}

/** A single post's frontmatter + raw MDX body, for the detail page. */
export function getPostBySlug(slug: string): { meta: PostMeta; content: string } | null {
    try {
        const { data, content } = readPostFile(slug)
        return { meta: toMeta(slug, data as Frontmatter, content), content }
    } catch {
        return null
    }
}
