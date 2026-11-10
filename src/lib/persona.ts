/**
 * Two people share this site. Alen is the default. Ban is the other one: he
 * gets let out at /ban (or with ?as=ban) and stays until someone puts him
 * back (the nav's [alen] button, /ban again, or ?as=alen).
 *
 * Who is in lives in localStorage and on <html data-persona>. The attribute is
 * set by PERSONA_BOOT_SCRIPT before first paint, so the page never flashes the
 * wrong person, and every page stays static: the server renders both people's
 * words (see components/persona.tsx) and CSS shows the one who is in.
 */
export type Persona = 'alen' | 'ban'

export const PERSONA_KEY = 'alen-persona'
/** `?as=ban` or `?as=alen` on any URL switches and then removes itself */
export const PERSONA_PARAM = 'as'
/** Fired on window after a switch so mounted components can follow */
export const PERSONA_EVENT = 'alen:persona'

export function getPersona(): Persona {
    if (typeof document === 'undefined') return 'alen'
    return document.documentElement.dataset.persona === 'ban' ? 'ban' : 'alen'
}

/** Switch immediately, no ceremony. */
export function setPersona(persona: Persona) {
    try {
        window.localStorage.setItem(PERSONA_KEY, persona)
    } catch {
        // No storage (private mode): the switch still holds until the next full load
    }
    document.documentElement.dataset.persona = persona
    window.dispatchEvent(new Event(PERSONA_EVENT))
}

/**
 * Make <html data-persona> agree with what is stored. The boot script does
 * this before first paint; this is the second line of defence, for the cases
 * where the attribute goes missing afterwards (React regenerating the whole
 * document after a hydration error drops attributes it did not render) or
 * where another tab changed who is in. Returns true if it had to fix anything.
 */
export function syncPersona(): boolean {
    let stored: Persona = 'alen'
    try {
        stored = window.localStorage.getItem(PERSONA_KEY) === 'ban' ? 'ban' : 'alen'
    } catch {
        // No storage: keep whoever the attribute says, defaulting to Alen
        stored = getPersona()
    }
    if (document.documentElement.dataset.persona === stored) return false
    document.documentElement.dataset.persona = stored
    window.dispatchEvent(new Event(PERSONA_EVENT))
    return true
}

/**
 * Switch with the tear: the new person's page is cut in across the old one.
 * Uses the View Transitions API, keyed off <html data-vt="persona"> so it gets
 * its own keyframes (the theme toggle uses the default ones). Falls back to an
 * instant switch without the API or under reduced motion.
 */
export function switchPersona(persona: Persona) {
    if (getPersona() === persona) return
    const root = document.documentElement
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || reduce) {
        setPersona(persona)
        return
    }
    root.dataset.vt = 'persona'
    const transition = document.startViewTransition(() => setPersona(persona))
    transition.finished.finally(() => {
        delete root.dataset.vt
    })
}

/**
 * Inlined at the top of <body> so it runs before anything paints. Kept as a
 * string of plain ES5: it ships as is, with no build step in between.
 */
export const PERSONA_BOOT_SCRIPT = `(function(){var d=document.documentElement;try{var k='${PERSONA_KEY}',u=new URL(location.href),q=u.searchParams.get('${PERSONA_PARAM}');if(q==='ban'||q==='alen'){localStorage.setItem(k,q);u.searchParams.delete('${PERSONA_PARAM}');history.replaceState(history.state,'',u.pathname+u.search+u.hash)}d.dataset.persona=localStorage.getItem(k)==='ban'?'ban':'alen'}catch(e){d.dataset.persona='alen'}})()`
