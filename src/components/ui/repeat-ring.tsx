import type { ReactNode } from 'react'

interface RepeatRingProps {
    /** How many times the track has come round recently. Under 3 the ring is not drawn */
    frequency: number
    /** From getStreakInfo: the conic sweep for this tier */
    gradient: string
    /** From getStreakInfo: the glow for this tier, if any */
    shadow?: string
    className?: string
    children: ReactNode
}

/**
 * The spinning border a track earns once it is on repeat. One copy for the
 * home card, the now-playing card on /listening and the album art on a track
 * page. Spins faster the deeper the obsession, floored at 1.5s a turn so a
 * long streak never reads as a strobe.
 */
export function RepeatRing({ frequency, gradient, shadow, className = '', children }: RepeatRingProps) {
    if (frequency < 3) return <div className={`relative ${className}`}>{children}</div>

    return (
        <div className={`relative p-[2px] rounded overflow-visible ${className}`}>
            {shadow && <div className="absolute inset-[2px] rounded z-[-1]" style={{ boxShadow: shadow }} />}
            <div className="absolute inset-0 rounded overflow-hidden z-[-2]">
                <div
                    className="absolute left-1/2 top-1/2 w-[1000px] h-[1000px] -ml-[500px] -mt-[500px] origin-center"
                    style={{
                        backgroundImage: gradient,
                        animation: `spin-slow ${Math.max(1.5, 4.5 - frequency * 0.25)}s linear infinite`
                    }}
                />
            </div>
            {children}
        </div>
    )
}
