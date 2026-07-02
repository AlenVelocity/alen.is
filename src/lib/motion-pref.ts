/**
 * Persisted "minimal motion" preference, toggled from the command bar.
 * When on, the UFO warp page transition is skipped (plain navigation).
 * Independent from the OS-level prefers-reduced-motion media query, which is
 * always honored regardless of this setting.
 */
export const MINIMAL_MOTION_KEY = 'alen-minimal-motion'

/** Fired after the preference changes so live components can re-read it */
export const MOTION_PREF_EVENT = 'alen:motion-pref'

export function isMinimalMotion(): boolean {
    if (typeof window === 'undefined') return false
    try {
        return window.localStorage.getItem(MINIMAL_MOTION_KEY) === '1'
    } catch {
        return false
    }
}

export function setMinimalMotion(minimal: boolean) {
    try {
        window.localStorage.setItem(MINIMAL_MOTION_KEY, minimal ? '1' : '0')
    } catch {
        // localStorage unavailable (private mode etc.) — preference just won't persist
    }
    window.dispatchEvent(new Event(MOTION_PREF_EVENT))
}
