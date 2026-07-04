import { renderOgImage, OG_SIZE } from '@/lib/og'

export const alt = 'alen.is'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
    return renderOgImage()
}
