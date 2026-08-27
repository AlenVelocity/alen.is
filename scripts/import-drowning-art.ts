/**
 * Turn hand-drawn SVGs into the art /drowning renders.
 *
 *   pnpm drowning:art
 *
 * Drop one file per creature into src/app/(adjectives)/drowning/art/, named
 * after the beat — crab.svg, octopus.svg, whale.svg — and this rewrites
 * art.generated.tsx. CreatureArt picks those up automatically; any creature
 * without a file keeps the built-in line art, so the set can be replaced a few
 * at a time.
 *
 * What it does to each file, and why:
 *
 *   · Attributes are converted to the names JSX wants (stroke-width →
 *     strokeWidth), so an editor's raw export pastes through untouched.
 *   · ids are namespaced per creature. Figma and Illustrator both emit
 *     generic ids like "clip0_1_2", and sixteen of these are inlined onto the
 *     same contact sheet — without prefixing, one creature's clip path
 *     silently applies to another.
 *   · A drawing that uses a single colour throughout is treated as monoline
 *     and rewired to currentColor, so it keeps picking up the accent and
 *     shifting with the depth zones. Anything using more than one colour is
 *     left exactly as drawn. Pass --keep-colors to always leave them alone.
 */

import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const DROWNING = join(process.cwd(), 'src', 'app', '(adjectives)', 'drowning')
const ART_DIR = join(DROWNING, 'art')
const OUT_FILE = join(DROWNING, 'art.generated.tsx')
const FIGURE_DIR = join(ART_DIR, 'figure')
const FIGURE_OUT = join(DROWNING, 'figure.generated.tsx')
/** The canvas every figure part is drawn on — must match FIGURE_VIEWBOX in figure.tsx */
const FIGURE_BOX = { w: 52, h: 76 }

const keepColours = process.argv.includes('--keep-colors')

/** Beat names, read out of creatures.tsx as text — no need to execute its JSX */
function beatNames(): string[] {
    const source = readFileSync(join(DROWNING, 'creatures.tsx'), 'utf8')
    return [...source.matchAll(/^\s{8}name: '([a-z-]+)',$/gm)].map((m) => m[1])
}

/** Figure part ids, read out of figure.tsx's PART_LIST as text */
function partIds(): string[] {
    const source = readFileSync(join(DROWNING, 'figure.tsx'), 'utf8')
    return [...source.matchAll(/\{ id: '([a-z-]+)',/g)].map((m) => m[1])
}

/**
 * Namespaces an editor uses to record its own state. Inkscape files are full
 * of these — sodipodi:nodetypes, inkscape:label, an RDF metadata block — and
 * none of it draws anything. JSX has no namespace support at all, so they are
 * dropped rather than renamed.
 */
const EDITOR_NAMESPACES = ['sodipodi', 'inkscape', 'rdf', 'cc', 'dc', 'i', 'graph']

/** The handful of namespaced attributes React does understand */
const KEPT_NAMESPACED: Record<string, string> = {
    'xlink:href': 'href',
    'xml:space': 'xmlSpace',
    'xml:lang': 'xmlLang'
}

/**
 * stroke-width → strokeWidth, but data-* and aria-* stay as they are.
 * Returns null for an attribute that should be dropped entirely.
 */
function toJsxAttr(name: string): string | null {
    if (name.startsWith('data-') || name.startsWith('aria-')) return name
    if (name === 'class') return 'className'
    if (name in KEPT_NAMESPACED) return KEPT_NAMESPACED[name]
    // Anything else carrying a namespace prefix cannot be expressed in JSX
    if (name.includes(':')) return null
    return name.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
}

/** style="fill:red;stroke-width:2" → style={{fill: 'red', strokeWidth: '2'}} */
function toJsxStyle(value: string): string {
    const entries = value
        .split(';')
        .map((d) => d.trim())
        .filter(Boolean)
        .map((d) => {
            const at = d.indexOf(':')
            if (at === -1) return null
            const prop = toJsxAttr(d.slice(0, at).trim())
            if (!prop) return null
            const val = d
                .slice(at + 1)
                .trim()
                .replace(/'/g, "\\'")
            return `${JSON.stringify(prop)}: '${val}'`
        })
        .filter(Boolean)
    return `{{${entries.join(', ')}}}`
}

/**
 * Every colour the drawing actually paints with, ignoring "none" and gradient
 * refs. <defs> is excluded: Figma puts fill="white" on the rect inside a clip
 * path, which is structural and would otherwise make every monoline export
 * look like it uses two colours.
 */
function coloursUsed(markup: string): Set<string> {
    const painted = markup.replace(/<defs\b[\s\S]*?<\/defs>/gi, '')
    const found = new Set<string>()
    for (const m of painted.matchAll(/(?:stroke|fill)="([^"]+)"/g)) {
        const v = m[1].trim()
        if (v && v !== 'none' && v !== 'transparent' && !v.startsWith('url(')) found.add(v.toLowerCase())
    }
    for (const m of painted.matchAll(/(?:stroke|fill)\s*:\s*([^;"']+)/g)) {
        const v = m[1].trim()
        if (v && v !== 'none' && v !== 'transparent' && !v.startsWith('url(')) found.add(v.toLowerCase())
    }
    return found
}

/**
 * A moving part: one element in the drawing, identified by its id, that gets
 * its own keyframe. Declared in art/parts.json so the SVG files stay pure
 * drawings and the artist only has to name a group.
 */
interface Part {
    /** Keyframe name in globals.css */
    anim: string
    /** Hinge, in viewBox units: "14.5 21" */
    origin: string
    /** Overrides the default easing */
    easing?: string
}

type PartsManifest = Record<string, Record<string, Part>>

function loadParts(): PartsManifest {
    const file = join(ART_DIR, 'parts.json')
    if (!existsSync(file)) return {}
    try {
        return JSON.parse(readFileSync(file, 'utf8')) as PartsManifest
    } catch (err) {
        console.warn(`  ! parts.json is not valid JSON (${(err as Error).message}) — ignoring it`)
        return {}
    }
}

/**
 * Give a named element its animation, by appending to its style attribute.
 *
 * Duration comes from --strike-ms, set per beat on the wrapper in descent.tsx,
 * so a moving part stays in step with whatever is carrying it across the
 * screen. transform-box: view-box makes the hinge resolve against the
 * drawing's own coordinates rather than the element's bounding box.
 */
function animatePart(markup: string, id: string, part: Part): { markup: string; found: boolean } {
    const [x, y] = part.origin.trim().split(/[\s,]+/)
    const easing = part.easing ?? 'cubic-bezier(0.3, 0, 0.4, 1)'
    const css = `transform-origin:${x}px ${y}px;transform-box:view-box;animation:${part.anim} var(--strike-ms) ${easing} both`

    const at = markup.indexOf(`id="${id}"`)
    if (at === -1) return { markup, found: false }

    // Widen from the id out to the opening tag it belongs to. Walking the string
    // beats matching the tag with a regex: editor output puts attributes in any
    // order and across line breaks, and ids can contain regex metacharacters.
    const start = markup.lastIndexOf('<', at)
    const end = markup.indexOf('>', at)
    if (start === -1 || end === -1) return { markup, found: false }

    let tag = markup.slice(start, end)
    const style = tag.match(/\sstyle="([^"]*)"/)
    tag = style ? tag.replace(style[0], ` style="${style[1].replace(/;\s*$/, '')};${css}"`) : `${tag} style="${css}"`

    return { markup: markup.slice(0, start) + tag + markup.slice(end), found: true }
}

interface Converted {
    viewBox: string
    body: string
    colours: number
    themed: boolean
    parts: string[]
    missingParts: string[]
}

function convert(name: string, file: string, parts: Record<string, Part>): Converted {
    let svg = readFileSync(file, 'utf8')

    // Drop anything that is not drawing: XML prolog, doctype, comments, metadata
    svg = svg
        .replace(/<\?xml[\s\S]*?\?>/g, '')
        .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<(metadata|title|desc)\b[\s\S]*?<\/\1>/gi, '')

    // …then the editor's own bookkeeping elements: <sodipodi:namedview>, the
    // RDF licence block, <inkscape:path-effect> and friends. Paired tags first,
    // so a self-closing pass cannot strand a closing tag.
    const ns = EDITOR_NAMESPACES.join('|')
    svg = svg
        .replace(new RegExp(`<((?:${ns}):[\\w.-]+)\\b[^>]*>[\\s\\S]*?</\\1>`, 'gi'), '')
        .replace(new RegExp(`<(?:${ns}):[\\w.-]+\\b[^>]*/>`, 'gi'), '')

    const root = svg.match(/<svg\b([^>]*)>([\s\S]*)<\/svg>/i)
    if (!root) throw new Error(`${name}: no <svg> element found`)

    const attrs = root[1]
    let body = root[2].trim()

    const viewBox =
        attrs.match(/viewBox="([^"]+)"/i)?.[1] ??
        (() => {
            const w = attrs.match(/\bwidth="([\d.]+)/i)?.[1]
            const h = attrs.match(/\bheight="([\d.]+)/i)?.[1]
            if (!w || !h) throw new Error(`${name}: needs a viewBox (or numeric width and height)`)
            return `0 0 ${w} ${h}`
        })()

    // Namespace ids so sixteen inlined drawings cannot capture each other's defs
    // Wire up moving parts before ids get namespaced, so parts.json can name the
    // id exactly as it appears in the file the artist drew
    const wired: string[] = []
    const missingParts: string[] = []
    for (const [id, part] of Object.entries(parts)) {
        const result = animatePart(body, id, part)
        body = result.markup
        ;(result.found ? wired : missingParts).push(id)
    }

    const ids = [...body.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1])
    for (const id of ids) {
        const safe = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        body = body
            .replace(new RegExp(`\\bid="${safe}"`, 'g'), `id="${name}-${id}"`)
            .replace(new RegExp(`url\\(#${safe}\\)`, 'g'), `url(#${name}-${id})`)
            .replace(new RegExp(`\\b(xlink:href|href)="#${safe}"`, 'g'), `$1="#${name}-${id}"`)
    }

    // Monoline drawings get wired to currentColor so the depth zones still tint them
    const colours = coloursUsed(body)
    const themed = !keepColours && colours.size === 1
    if (themed) {
        const only = [...colours][0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        body = body.replace(new RegExp(`((?:stroke|fill)=")${only}(")`, 'gi'), '$1currentColor$2')
        body = body.replace(new RegExp(`((?:stroke|fill)\\s*:\\s*)${only}`, 'gi'), '$1currentColor')
    }

    // Inner elements never need their own namespace declarations
    body = body.replace(/\s+xmlns(:\w+)?="[^"]*"/g, '')

    // style="…" has to become an object before the attribute rename touches it
    body = body.replace(/\bstyle="([^"]*)"/g, (_, v: string) => `style=${toJsxStyle(v)}`)

    // Everything else: rename attributes to their JSX spelling, or drop the ones
    // that have no JSX spelling at all (sodipodi:nodetypes, inkscape:label, …)
    body = body.replace(/\s([a-zA-Z_:][\w:.-]*)=("[^"]*")/g, (whole, attr: string, value: string) => {
        const jsx = toJsxAttr(attr)
        if (jsx === null) return ''
        return jsx === attr ? whole : ` ${jsx}=${value}`
    })

    return { viewBox, body, colours: colours.size, themed, parts: wired, missingParts }
}

/**
 * The figure is assembled from named parts, so its hand-drawn replacements go
 * in one per part rather than one per drawing: art/figure/<part-id>.svg,
 * matching the ids in figure.tsx's PART_LIST. Files keep whatever name the
 * contact sheet gave them, so a leading "part-" is optional.
 */
function importFigureParts(): number {
    if (!existsSync(FIGURE_DIR)) mkdirSync(FIGURE_DIR, { recursive: true })

    const ids = partIds()
    if (ids.length === 0) throw new Error('Could not read PART_LIST out of figure.tsx')

    const files = readdirSync(FIGURE_DIR).filter((f) => f.toLowerCase().endsWith('.svg'))
    const entries: string[] = []

    for (const file of files.sort()) {
        const id = file.replace(/\.svg$/i, '').replace(/^part-/, '')
        if (!ids.includes(id)) {
            console.warn(`  ! ${file} — no figure part called "${id}", skipped`)
            continue
        }
        try {
            const { viewBox, body, themed, colours } = convert(id, join(FIGURE_DIR, file), {})

            // Parts are inlined straight into the figure's own canvas, so one drawn
            // on a different viewBox is mapped onto it rather than landing in the
            // wrong place at the wrong size.
            const [minX, minY, w, h] = viewBox.split(/[\s,]+/).map(Number)
            const sx = FIGURE_BOX.w / w
            const sy = FIGURE_BOX.h / h
            const offGrid = minX !== 0 || minY !== 0 || Math.abs(sx - 1) > 0.001 || Math.abs(sy - 1) > 0.001
            const fit = offGrid
                ? `translate(${(-minX * sx).toFixed(3)} ${(-minY * sy).toFixed(3)}) scale(${sx.toFixed(4)} ${sy.toFixed(4)})`
                : null

            // Editors write stroke-dasharray:none on every stroke, which would block
            // the burnt-outline state cascading down from Figure. Drop it so the
            // dash can still be applied from above.
            const cleaned = body
                .replace(/,?\s*"strokeDasharray":\s*'[^']*'/g, '')
                .replace(/\s+strokeDasharray="[^"]*"/g, '')
                .replace(/\{\{,\s*/g, '{{')

            const indented = cleaned
                .split('\n')
                .map((l) => (l.trim() ? `                ${l.trim()}` : ''))
                .join('\n')

            const wrapped = fit ? `            <g transform="${fit}">\n${indented}\n            </g>` : indented

            entries.push(`    '${id}': (\n        <>\n${wrapped}\n        </>\n    )`)
            const note = themed ? 'monoline → currentColor' : `${colours} colours kept`
            const fitNote = fit ? `  · refitted from ${viewBox}` : ''
            console.log(`  ✓ ${id.padEnd(18)} ${note}${fitNote}`)
        } catch (err) {
            console.error(`  ✗ ${file} — ${(err as Error).message}`)
        }
    }

    const out = `import type { ReactNode } from 'react'

/**
 * GENERATED by scripts/import-drowning-art.ts — do not edit by hand.
 * Run \`pnpm drowning:art\` after changing anything in ./art/figure/.
 *
 * Hand-drawn replacements for the figure's parts, keyed by the ids in
 * PART_LIST. Figure prefers these; parts with no entry keep their built-in
 * drawing, so the figure can be replaced a piece at a time.
 */
export const HAND_DRAWN_PARTS: Record<string, ReactNode> = {
${entries.join(',\n')}
}
`
    writeFileSync(FIGURE_OUT, out, 'utf8')
    return entries.length
}

function main() {
    if (!existsSync(ART_DIR)) {
        mkdirSync(ART_DIR, { recursive: true })
        console.log(`Created ${ART_DIR} — drop <beat>.svg files in there and run this again.`)
    }

    const names = beatNames()
    if (names.length === 0) throw new Error('Could not read any beat names out of creatures.tsx')

    const manifest = loadParts()
    const files = readdirSync(ART_DIR).filter((f) => f.toLowerCase().endsWith('.svg'))
    const entries: string[] = []

    for (const file of files.sort()) {
        const name = file.replace(/\.svg$/i, '')
        if (!names.includes(name)) {
            console.warn(`  ! ${file} — no beat called "${name}", skipped (expected one of: ${names.join(', ')})`)
            continue
        }
        try {
            const { viewBox, body, colours, themed, parts, missingParts } = convert(
                name,
                join(ART_DIR, file),
                manifest[name] ?? {}
            )
            entries.push(
                `    ${name}: {\n        viewBox: '${viewBox}',\n        art: (\n            <>\n${body
                    .split('\n')
                    .map((l) => (l.trim() ? `                ${l.trim()}` : ''))
                    .join('\n')}\n            </>\n        )\n    }`
            )
            const colourNote = themed ? 'monoline → currentColor' : `${colours} colour${colours === 1 ? '' : 's'} kept`
            const partNote = parts.length ? `  · animates: ${parts.join(', ')}` : ''
            console.log(`  ✓ ${name.padEnd(12)} ${viewBox.padEnd(14)} ${colourNote}${partNote}`)
            for (const id of missingParts) {
                console.warn(`      ! parts.json wants #${id}, but ${file} has no element with that id`)
            }
        } catch (err) {
            console.error(`  ✗ ${file} — ${(err as Error).message}`)
        }
    }

    const missing = names.filter((n) => !files.some((f) => f.replace(/\.svg$/i, '') === n))

    const out = `import type { ReactNode } from 'react'

/**
 * GENERATED by scripts/import-drowning-art.ts — do not edit by hand.
 * Run \`pnpm drowning:art\` after changing anything in ./art/.
 *
 * Hand-drawn replacements for the built-in line art, keyed by beat name.
 * CreatureArt prefers these; beats with no entry keep their original drawing.
 */
export const HAND_DRAWN: Record<string, { viewBox: string; art: ReactNode }> = {
${entries.join(',\n')}
}
`

    writeFileSync(OUT_FILE, out, 'utf8')
    console.log(`\nWrote ${entries.length} drawing${entries.length === 1 ? '' : 's'} to art.generated.tsx`)
    if (missing.length) console.log(`Still using built-in line art: ${missing.join(', ')}`)

    console.log('\nFigure parts:')
    const drawnParts = importFigureParts()
    const stillBuilt = partIds().length - drawnParts
    console.log(`Wrote ${drawnParts} part${drawnParts === 1 ? '' : 's'} to figure.generated.tsx`)
    if (stillBuilt > 0) console.log(`${stillBuilt} part${stillBuilt === 1 ? '' : 's'} still using built-in art`)
}

if (process.argv[1]?.includes('import-drowning-art')) main()
