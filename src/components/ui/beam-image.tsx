'use client'

import Image, { type ImageProps } from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { isMinimalMotion } from '@/lib/motion-pref'

type BeamImageProps = Omit<ImageProps, 'fill' | 'onLoad'>

/**
 * A `fill` image that arrives instead of popping in. The first time it is
 * loaded and on screen it is revealed once: beamed down top to bottom for
 * Alen, uncensored sideways for Ban. Must sit in a positioned container, like
 * any `fill` image.
 *
 * This component only decides when; the reveal itself is CSS keyed off
 * `data-phase` (see IMAGE REVEAL in globals.css), so it costs no canvas and
 * no per-frame JavaScript.
 *
 * Server HTML ships the image hidden and a <noscript> rule in the root layout
 * shows it again, so the effect never costs a visitor without JavaScript the
 * picture. Reduced motion and the site's minimal-motion setting skip it.
 */
export function BeamImage({ className, onError, ...props }: BeamImageProps) {
    const boxRef = useRef<HTMLDivElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)
    const [phase, setPhase] = useState<'hidden' | 'beaming' | 'done'>('hidden')
    const loadedRef = useRef(false)
    const visibleRef = useRef(false)
    const startedRef = useRef(false)

    const maybeStart = useCallback(() => {
        if (startedRef.current || !loadedRef.current || !visibleRef.current) return
        startedRef.current = true
        setPhase('beaming')
    }, [])

    useEffect(() => {
        if (isMinimalMotion() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setPhase('done')
            return
        }
        const box = boxRef.current
        if (!box) return
        const io = new IntersectionObserver(
            (entries) => {
                if (!entries.some((e) => e.isIntersecting)) return
                visibleRef.current = true
                maybeStart()
                io.disconnect()
            },
            { rootMargin: '48px' }
        )
        io.observe(box)
        // A cached image can be complete before React attaches onLoad
        const img = imgRef.current
        if (img && img.complete && img.naturalWidth > 0) {
            loadedRef.current = true
            maybeStart()
        }
        return () => io.disconnect()
    }, [maybeStart])

    // The reveal normally ends itself via onAnimationEnd. A hidden tab never runs
    // the animation, so this makes sure the picture does not wait on one forever.
    useEffect(() => {
        if (phase !== 'beaming') return
        const id = setTimeout(() => setPhase('done'), 1200)
        return () => clearTimeout(id)
    }, [phase])

    return (
        <div ref={boxRef} className="beam-image absolute inset-0" data-phase={phase}>
            <Image
                ref={imgRef}
                {...props}
                fill
                className={cn(className)}
                onLoad={() => {
                    loadedRef.current = true
                    maybeStart()
                }}
                onAnimationEnd={() => setPhase('done')}
                onError={(event) => {
                    setPhase('done')
                    onError?.(event)
                }}
            />
        </div>
    )
}
