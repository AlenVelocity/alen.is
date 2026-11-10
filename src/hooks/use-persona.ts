'use client'

import { useSyncExternalStore } from 'react'
import { getPersona, PERSONA_EVENT, PERSONA_KEY, syncPersona, type Persona } from '@/lib/persona'

function subscribe(onChange: () => void) {
    // Another tab switched: follow it
    const onStorage = (event: StorageEvent) => {
        if (event.key === PERSONA_KEY) syncPersona()
    }
    window.addEventListener(PERSONA_EVENT, onChange)
    window.addEventListener('storage', onStorage)
    // Subscribing happens after hydration, which is when a regenerated
    // document would have lost the attribute. Put it back if so.
    syncPersona()
    return () => {
        window.removeEventListener(PERSONA_EVENT, onChange)
        window.removeEventListener('storage', onStorage)
    }
}

/**
 * Who is in, for client components whose behaviour changes with it (the page
 * transition, the rain, the nav). The server always renders as Alen and the
 * client corrects itself right after hydration, so use this for behaviour and
 * use <Persona> for words: words rendered through this hook would flash.
 */
export function usePersona(): Persona {
    return useSyncExternalStore(subscribe, getPersona, () => 'alen')
}
