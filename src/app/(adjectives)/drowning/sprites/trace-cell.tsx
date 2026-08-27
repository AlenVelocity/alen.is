'use client'

import { useCallback, useRef, useState } from 'react'
import { SPRITE_CANVAS, SPRITE_PX } from '../creatures'

/**
 * One cell on the contact sheet, with two ways to take the drawing away and
 * redraw it yourself.
 *
 * `.svg` is the one to reach for: it hands over the real path data at the
 * source viewBox's own scale, so coordinates round-trip 1:1 — open it in
 * Figma or Inkscape, redraw over the actual curves, and the paths paste
 * straight back into `art` still keyed to the same grid.
 *
 * `.png` rasterises at SPRITE_PX for the pixel route, where you are tracing a
 * silhouette onto a SPRITE_CANVAS grid rather than editing curves.
 *
 * Both read the SVG as the page is currently drawing it, so a reference can
 * never drift out of sync with what ships.
 */

interface TraceCellProps {
    title: string
    note: string
    /** Filename stem for the export, e.g. "crab" → crab.svg */
    slug: string
    /** False once the cell holds a finished sprite instead of traceable line art */
    traceable?: boolean
    children: React.ReactNode
}

/**
 * Ink for exported references.
 *
 * `currentColor` is resolved to this rather than to whatever the element is
 * painted on screen, because the on-screen colour is a theme value, not the
 * art: the figure renders at a pale near-white, which lands invisible on an
 * editor's white canvas. Opaque near-black reads in every editor, and the
 * colour is thrown away on the way back in anyway — the importer maps a
 * single-colour drawing to `currentColor` so it re-tints with the depth zones.
 */
const EXPORT_INK = '#111111'

/**
 * Copy the live SVG into a standalone document an editor will open cleanly.
 *
 * Three things have to be undone. `currentColor` means nothing once the markup
 * leaves the page, so it is resolved to EXPORT_INK. Colours the art actually
 * declares are left alone, since those are deliberate. And the inline style
 * carries CreatureArt's mirroring for left-swimming creatures, which is a
 * rendering concern: the file should hold the canonical orientation.
 */
function standalone(source: SVGSVGElement, square?: number) {
    const clone = source.cloneNode(true) as SVGSVGElement

    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    clone.removeAttribute('aria-hidden')
    clone.removeAttribute('class')
    clone.removeAttribute('style')
    clone.setAttribute('color', EXPORT_INK)

    for (const el of clone.querySelectorAll('*')) {
        for (const attr of ['stroke', 'fill']) {
            if (el.getAttribute(attr) === 'currentColor') el.setAttribute(attr, EXPORT_INK)
        }
    }

    // Square for the raster route (preserveAspectRatio letterboxes, so nothing
    // distorts); native viewBox units for the vector route, to keep it 1:1.
    const box = source.viewBox.baseVal
    clone.setAttribute('width', String(square ?? box.width))
    clone.setAttribute('height', String(square ?? box.height))
    return clone
}

/** Hand a blob to the browser as a download */
function save(blob: Blob, filename: string) {
    const href = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = href
    a.download = filename
    a.click()
    URL.revokeObjectURL(href)
}

export function TraceCell({ title, note, slug, traceable = true, children }: TraceCellProps) {
    const ref = useRef<HTMLLIElement>(null)
    const [failed, setFailed] = useState<'svg' | 'png' | null>(null)

    const exportSvg = useCallback(() => {
        const source = ref.current?.querySelector('svg')
        if (!source) return
        try {
            const markup = new XMLSerializer().serializeToString(standalone(source))
            save(new Blob([markup], { type: 'image/svg+xml' }), `${slug}.svg`)
            setFailed(null)
        } catch {
            setFailed('svg')
        }
    }, [slug])

    const exportPng = useCallback(async () => {
        const source = ref.current?.querySelector('svg')
        if (!source) return
        try {
            const markup = new XMLSerializer().serializeToString(standalone(source, SPRITE_PX))
            const svgUrl = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml' }))

            const img = new Image()
            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve()
                img.onerror = () => reject(new Error('svg failed to rasterise'))
                img.src = svgUrl
            })

            const canvas = document.createElement('canvas')
            canvas.width = SPRITE_PX
            canvas.height = SPRITE_PX
            canvas.getContext('2d')?.drawImage(img, 0, 0, SPRITE_PX, SPRITE_PX)
            URL.revokeObjectURL(svgUrl)

            const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
            if (!blob) throw new Error('canvas produced no blob')
            save(blob, `${slug}.png`)
            setFailed(null)
        } catch {
            setFailed('png')
        }
    }, [slug])

    return (
        <li
            ref={ref}
            className="group flex flex-col items-center gap-3 rounded-sm border border-dashed border-border/50 p-4"
        >
            <div className="flex h-36 w-full items-center justify-center overflow-hidden">{children}</div>
            <div className="text-center">
                <p className="mono-label text-accent">{title}</p>
                <p className="mono-label text-muted-foreground/60">{note}</p>
            </div>
            {traceable && (
                <div className="flex items-center gap-2">
                    <button
                        onClick={exportSvg}
                        className="mono-label text-muted-foreground/50 transition-colors duration-150 hover:text-accent group-hover:text-muted-foreground/80"
                        title="Export the real paths at viewBox scale — redraw over these in Figma or Inkscape"
                    >
                        {failed === 'svg' ? 'svg failed' : '.svg'}
                    </button>
                    <span className="text-border">·</span>
                    <button
                        onClick={exportPng}
                        className="mono-label text-muted-foreground/50 transition-colors duration-150 hover:text-accent group-hover:text-muted-foreground/80"
                        title={`Rasterise at ${SPRITE_PX}×${SPRITE_PX} to trace onto a ${SPRITE_CANVAS}×${SPRITE_CANVAS} pixel canvas`}
                    >
                        {failed === 'png' ? 'png failed' : '.png'}
                    </button>
                </div>
            )}
        </li>
    )
}
