import { NextRequest } from 'next/server'
import { renderOgImage, type OgKind } from '@/lib/og'
import { ALL_PAGE_SLUGS, ADJECTIVE_SLUGS, PROFESSIONAL_SLUGS } from '@/lib/routes'

// Dynamic OG card: adjectives ask ("alen is cool?"), professional pages
// declare ("alen is building!"), other real pages state it plainly, and
// made-up words come out doubtful ("alen is flying?" + UNVERIFIED).
export function GET(request: NextRequest) {
    const raw = request.nextUrl.searchParams.get('is') ?? ''
    const word = raw
        .replace(/[^a-z0-9 .-]/gi, '')
        .slice(0, 20)
        .toLowerCase()
        .trim()
    if (!word) return renderOgImage()

    const kind: OgKind = ADJECTIVE_SLUGS.has(word)
        ? 'adjective'
        : PROFESSIONAL_SLUGS.has(word)
          ? 'professional'
          : ALL_PAGE_SLUGS.has(word)
            ? 'page'
            : 'unknown'

    return renderOgImage(word, kind)
}
