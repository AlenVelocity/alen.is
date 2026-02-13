// ─── Last.fm URL param helpers ──────────────────────────────────────────────

/**
 * Encode an artist or track name for use in a URL path segment.
 * Lowercases, replaces whitespace with hyphens, but preserves non-Latin characters.
 *
 * Example: encodeTrackParam('Shoji Meguro') → 'shoji-meguro'
 * Example: encodeTrackParam('エン') → 'エン'
 */
export function encodeTrackParam(value: string): string {
    return value
        .trim()
        .replace(/\s+/g, '-')
        .toLowerCase()
}

/**
 * Decode a URL path segment back into a human-readable search term.
 * Handles percent-encoding (for non-Latin chars) and replaces hyphens with spaces.
 *
 * Example: decodeTrackParam('shoji-meguro') → 'shoji meguro'
 * Example: decodeTrackParam('%E3%82%A8%E3%83%B3') → 'エン'
 */
export function decodeTrackParam(param: string): string {
    return decodeURIComponent(param).replace(/-/g, ' ')
}
