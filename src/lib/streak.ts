export function calculateFrequency(currentTrack: { name: string, artist: string } | null, recentlyPlayed: { name: string, artist: string }[]) {
    if (!currentTrack) return 1
    let frequency = 1
    for (const track of recentlyPlayed) {
        if (track.name.toLowerCase() === currentTrack.name.toLowerCase() && track.artist.toLowerCase() === currentTrack.artist.toLowerCase()) {
            frequency++
        } else {
            break
        }
    }
    return frequency
}

export function getStreakInfo(nowPlayingFrequency: number, isNowPlaying: boolean, size: 'small' | 'large' = 'small', minimal: boolean = false) {
    let subtitle = isNowPlaying ? 'Now playing' : 'Recently played'
    
    if (isNowPlaying) {
        if (minimal) {
            subtitle = 'Now Listening'
        } else {
            if (nowPlayingFrequency >= 50) subtitle = "I'm in love"
            else if (nowPlayingFrequency >= 25) subtitle = "Addicted"
            else if (nowPlayingFrequency >= 20) subtitle = "Unhealthy"
            else if (nowPlayingFrequency >= 15) subtitle = "Obsessed"
            else if (nowPlayingFrequency >= 10) subtitle = "Can't Get Enough"
            else if (nowPlayingFrequency >= 7) subtitle = "Heavy Rotation"
            else if (nowPlayingFrequency >= 5) subtitle = "Running It Back"
            else if (nowPlayingFrequency >= 3) subtitle = "On Repeat"
        }
    }

    let borderGradient = 'conic-gradient(from 0deg, #ff0000, #ff8000, #ffff00, #00ff00, #0000ff, #8000ff, #ff0000)'
    let shadowStyle = undefined
    let rawColor = 'rgba(0, 255, 0, 0.1)' // For custom radial background usages

    if (nowPlayingFrequency >= 50) {
        borderGradient = 'conic-gradient(from 0deg, #090014, #ff007f, #330066, #00f0ff, #090014)'
        shadowStyle = size === 'large' ? '0 0 40px rgba(255, 0, 127, 0.4)' : '0 0 15px rgba(255, 0, 127, 0.3)'
        rawColor = 'rgba(255, 0, 127, 0.3)'
    } else if (nowPlayingFrequency >= 25) {
        borderGradient = 'conic-gradient(from 0deg, #ff0055, #ff00ff, #00ffff, #ff00ff, #ff0055)'
        shadowStyle = size === 'large' ? '0 0 30px rgba(255, 0, 255, 0.3)' : '0 0 12px rgba(255, 0, 255, 0.25)'
        rawColor = 'rgba(255, 0, 255, 0.3)'
    } else if (nowPlayingFrequency >= 20) {
        borderGradient = 'conic-gradient(from 0deg, #ff6a00, #ffb300, #ffeb3b, #ffb300, #ff6a00)'
        shadowStyle = size === 'large' ? '0 0 20px rgba(255, 179, 0, 0.3)' : '0 0 10px rgba(255, 179, 0, 0.2)'
        rawColor = 'rgba(255, 179, 0, 0.3)'
    } else if (nowPlayingFrequency >= 3) {
        shadowStyle = size === 'large' ? '0 0 15px rgba(0, 255, 0, 0.15)' : '0 0 6px rgba(0, 255, 0, 0.1)'
        rawColor = 'rgba(0, 255, 0, 0.15)'
    }

    return { subtitle, borderGradient, shadowStyle, rawColor }
}
