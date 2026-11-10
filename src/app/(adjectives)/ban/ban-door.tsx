'use client'

import Link from 'next/link'
import { Persona } from '@/components/persona'
import { switchPersona, type Persona as Who } from '@/lib/persona'
import { posthog } from '@/components/posthog-provider'

const BUTTON =
    'mono-label inline-flex items-center px-4 py-2.5 border border-border/60 rounded-sm text-muted-foreground hover:text-accent hover:border-accent/50 transition-colors duration-200'

/** The one control on /ban: lets Ban out, and once he is out, puts him back. */
export function BanDoor() {
    const letIn = (who: Who) => {
        switchPersona(who)
        posthog.capture('persona_switch', { to: who, from: 'ban_page' })
    }

    return (
        <Persona
            as="div"
            alen={
                <button onClick={() => letIn('ban')} className={BUTTON}>
                    let him out
                </button>
            }
            ban={
                <div className="flex flex-col items-center gap-4">
                    <Link href="/" className={BUTTON}>
                        Look around
                    </Link>
                    <button
                        onClick={() => letIn('alen')}
                        className="mono-label text-muted-foreground/50 hover:text-accent transition-colors duration-200"
                    >
                        Put him back
                    </button>
                </div>
            }
        />
    )
}
