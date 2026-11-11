/** Plays in a row before a track earns the spinning ring */
export const RING_FROM = 3
/** From here the ring stops following the palette and gets colours of its own */
export const LOUD_FROM = 20

/**
 * How many times in a row `currentTrack` has come round. `recentlyPlayed` is
 * newest first and must not include `currentTrack` itself (Last.fm lists the
 * playing track separately), or the count comes out one too high.
 */
export function calculateFrequency(
    currentTrack: { name: string; artist: string } | null,
    recentlyPlayed: { name: string; artist: string }[]
) {
    if (!currentTrack) return 1
    let frequency = 1
    for (const track of recentlyPlayed) {
        if (
            track.name.toLowerCase() === currentTrack.name.toLowerCase() &&
            track.artist.toLowerCase() === currentTrack.artist.toLowerCase()
        ) {
            frequency++
        } else {
            break
        }
    }
    return frequency
}

/**
 * What a streak is called, by each of them. Checked top down: the first tier
 * the count reaches wins. Alen confesses a little more at each step. Ban
 * blames the neighbours and the hardware.
 */
const TIERS: { from: number; alen: string; ban: string }[] = [
    { from: 50, alen: "i'm in love", ban: 'I admit nothing.' },
    { from: 25, alen: 'addicted', ban: 'The skip button is broken.' },
    { from: LOUD_FROM, alen: 'unhealthy', ban: 'The neighbours know the words.' },
    { from: 15, alen: 'obsessed', ban: "It's the only song now." },
    { from: 10, alen: "can't get enough", ban: 'Nobody else gets a turn.' },
    { from: 7, alen: 'heavy rotation', ban: 'Still this one.' },
    { from: 5, alen: 'running it back', ban: 'Again. On purpose.' },
    { from: RING_FROM, alen: 'on repeat', ban: 'Again.' }
]

/**
 * The label and the ring for a track, given how many times it has come round.
 *
 * `subtitle` is Alen's label and `banSubtitle` is Ban's for the same state:
 * render the pair through <Persona>. `minimal` keeps both to the plain
 * "now playing" however long the streak is (the home card).
 */
export function getStreakInfo(
    nowPlayingFrequency: number,
    isNowPlaying: boolean,
    size: 'small' | 'large' = 'small',
    minimal: boolean = false
) {
    let subtitle = isNowPlaying ? 'now playing' : 'recently played'
    let banSubtitle = isNowPlaying ? 'Playing now.' : 'Played earlier.'

    if (isNowPlaying && !minimal) {
        const tier = TIERS.find((t) => nowPlayingFrequency >= t.from)
        if (tier) {
            subtitle = tier.alen
            banSubtitle = tier.ban
        }
    }

    // Under LOUD_FROM the ring and its glow are the accent, so they change hands with the palette
    let borderGradient =
        'conic-gradient(from 0deg, transparent 0%, transparent 40%, hsl(var(--accent)) 60%, hsl(var(--foreground)) 80%, transparent 100%)'
    let shadowStyle: string | undefined = undefined

    if (nowPlayingFrequency >= 50) {
        borderGradient = 'conic-gradient(from 0deg, #090014, #ff007f, #330066, #00f0ff, #090014)'
        shadowStyle = size === 'large' ? '0 0 40px rgba(255, 0, 127, 0.4)' : '0 0 15px rgba(255, 0, 127, 0.3)'
    } else if (nowPlayingFrequency >= 25) {
        borderGradient = 'conic-gradient(from 0deg, #ff0055, #ff00ff, #00ffff, #ff00ff, #ff0055)'
        shadowStyle = size === 'large' ? '0 0 30px rgba(255, 0, 255, 0.3)' : '0 0 12px rgba(255, 0, 255, 0.25)'
    } else if (nowPlayingFrequency >= LOUD_FROM) {
        borderGradient = 'conic-gradient(from 0deg, #ff6a00, #ffb300, #ffeb3b, #ffb300, #ff6a00)'
        shadowStyle = size === 'large' ? '0 0 20px rgba(255, 179, 0, 0.3)' : '0 0 10px rgba(255, 179, 0, 0.2)'
    } else if (nowPlayingFrequency >= RING_FROM) {
        shadowStyle = size === 'large' ? '0 0 15px hsl(var(--accent) / 0.15)' : '0 0 6px hsl(var(--accent) / 0.1)'
    }

    return { subtitle, banSubtitle, borderGradient, shadowStyle }
}
