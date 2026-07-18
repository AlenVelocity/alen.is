import { Metadata } from 'next'
import { list } from '@vercel/blob'
import { PageTransition } from '@/components/ui/page-transition'

import { constructMetadata } from '@/lib/metadata'

export const metadata: Metadata = constructMetadata({
    title: 'Sharing',
    description: 'Files hosted straight off the site',
    slug: 'sharing',
    ogTitle: 'Alen is Sharing'
})

// Re-list the blob store at most once a minute
export const revalidate = 60

/**
 * /sharing — lists the Vercel Blob store. /sharing/<filename> is rewritten to
 * the blob's public CDN URL in next.config.mjs, so links stay on this domain.
 */

interface SharedFile {
    name: string
    ext: string
    size: number
    uploadedAt: Date
}

async function getSharedFiles(): Promise<SharedFile[]> {
    try {
        const { blobs } = await list()
        return blobs
            .map((blob) => {
                const ext = blob.pathname.split('.').length > 1 ? blob.pathname.split('.').pop()!.toLowerCase() : 'file'
                return { name: blob.pathname, ext, size: blob.size, uploadedAt: blob.uploadedAt }
            })
            .sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
    } catch {
        // No BLOB_READ_WRITE_TOKEN (e.g. local dev without the token in .env.local)
        return []
    }
}

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function FileRow({ file }: { file: SharedFile }) {
    const href = `/sharing/${file.name.split('/').map(encodeURIComponent).join('/')}`

    return (
        <div className="group flex items-baseline gap-3 py-3 border-b border-dashed border-border/40 transition-colors duration-150 hover:border-accent/30">
            <span className="mono-label text-muted-foreground/40 w-16 shrink-0 text-right hidden sm:block">
                {file.ext}
            </span>

            <span className="text-border/60 hidden sm:block shrink-0">·</span>

            <a
                href={href}
                className="font-mono-ui text-sm font-medium transition-colors duration-150 group-hover:text-accent break-all"
            >
                {file.name}
            </a>

            <span className="flex-1 border-b border-dotted border-muted-foreground/10 translate-y-[-4px] hidden md:block" />

            <span className="mono-label text-muted-foreground/45 text-right shrink-0">{formatSize(file.size)}</span>

            <a
                href={`${href}?download=1`}
                className="mono-label text-muted-foreground/60 hover:text-accent border border-border/50 hover:border-accent/30 px-1.5 py-0.5 rounded-sm shrink-0 transition-colors duration-150"
            >
                get ↓
            </a>
        </div>
    )
}

export default async function Sharing() {
    const files = await getSharedFiles()

    return (
        <PageTransition>
            <div className="container max-w-2xl py-12 md:py-20 px-4">
                {/* Header */}
                <div className="mb-16">
                    <p className="mono-label text-muted-foreground/50 mb-4">// file drop</p>
                    <h1 className="text-display text-5xl md:text-6xl mb-3">Sharing</h1>
                    <p className="text-[0.9rem] text-muted-foreground">
                        Files hosted straight off the site. Click to open, or grab a copy.
                    </p>
                </div>

                {files.length > 0 ? (
                    <div>
                        {files.map((file) => (
                            <FileRow key={file.name} file={file} />
                        ))}
                    </div>
                ) : (
                    <p className="mono-label text-muted-foreground">
                        nothing shared right now
                        <span className="animate-blink text-accent ml-1">█</span>
                    </p>
                )}
            </div>
        </PageTransition>
    )
}
