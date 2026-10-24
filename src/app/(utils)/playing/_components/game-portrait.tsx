'use client'

import { useState } from 'react'
import Image from 'next/image'

interface GamePortraitProps {
    /** Steam's vertical library capsule (600x900) */
    portraitSrc: string
    /** The landscape store header, used to build a tile when there is no capsule */
    headerSrc: string
    name: string
    sizes: string
}

/**
 * A Steam library tile. Most games have a vertical capsule at a guessable
 * URL; newer ones file their art under a content hash and only the header is
 * reachable (via the store API). Steam's own library handles that case by
 * sitting the header on a dark tile with the name under it, so this does the
 * same, and falls back to a name-only tile when even the header is missing.
 * Must be rendered inside a positioned 2:3 container.
 */
export function GamePortrait({ portraitSrc, headerSrc, name, sizes }: GamePortraitProps) {
    const [stage, setStage] = useState<'portrait' | 'header' | 'name'>('portrait')

    if (stage === 'portrait') {
        return (
            <Image
                src={portraitSrc}
                alt={name}
                fill
                sizes={sizes}
                className="object-cover"
                onError={() => setStage('header')}
            />
        )
    }

    if (stage === 'header') {
        return (
            <div className="absolute inset-0 bg-muted/60">
                {/* The same art, blurred, so the tile isn't a flat slab behind the letterboxed header */}
                <Image
                    src={headerSrc}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes={sizes}
                    className="object-cover scale-125 blur-md opacity-40"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-2">
                    <div className="relative w-full aspect-[460/215] overflow-hidden rounded-sm ring-1 ring-border/40 shadow-md">
                        <Image
                            src={headerSrc}
                            alt={name}
                            fill
                            sizes={sizes}
                            className="object-cover"
                            onError={() => setStage('name')}
                        />
                    </div>
                    <p className="text-display text-[0.7rem] leading-tight text-center text-foreground/90 line-clamp-3 [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]">
                        {name}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div
            role="img"
            aria-label={name}
            className="absolute inset-0 flex items-center justify-center p-3 bg-gradient-to-b from-muted/60 to-muted/20"
        >
            <p className="text-display text-sm leading-tight text-center text-muted-foreground line-clamp-4">{name}</p>
        </div>
    )
}
