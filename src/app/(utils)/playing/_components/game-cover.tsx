'use client'

import { useState } from 'react'
import Image from 'next/image'
import { GiGamepad } from 'react-icons/gi'

interface GameCoverProps {
    src: string
    /** Smaller art to try when the cover 404s. Steam's library icon keeps a stable URL even when the store header does not. */
    fallbackSrc?: string
    alt: string
    sizes: string
    className?: string
}

/**
 * Steam files newer apps' store art under a content-hash folder, so the
 * guessable /apps/{appid}/header.jpg path returns 404 for them. Rather than
 * leave alt text sitting in the row, try the cover, then the library icon,
 * then a plain tile. Must be rendered inside a positioned, sized container.
 */
export function GameCover({ src, fallbackSrc, alt, sizes, className }: GameCoverProps) {
    const [stage, setStage] = useState<'cover' | 'icon' | 'blank'>('cover')
    const hasFallback = Boolean(fallbackSrc) && fallbackSrc !== src

    if (stage === 'cover') {
        return (
            <Image
                src={src}
                alt={alt}
                fill
                sizes={sizes}
                className={className}
                onError={() => setStage(hasFallback ? 'icon' : 'blank')}
            />
        )
    }

    if (stage === 'icon' && fallbackSrc) {
        return (
            <div className="absolute inset-0 bg-muted/40">
                <Image
                    src={fallbackSrc}
                    alt={alt}
                    fill
                    sizes="32px"
                    unoptimized
                    className="object-contain p-1"
                    onError={() => setStage('blank')}
                />
            </div>
        )
    }

    return (
        <div role="img" aria-label={alt} className="absolute inset-0 bg-muted/40 flex items-center justify-center">
            <GiGamepad className="w-4 h-4 text-muted-foreground/40" />
        </div>
    )
}
