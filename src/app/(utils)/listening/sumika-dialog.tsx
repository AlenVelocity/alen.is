'use client'

import Image from 'next/image'
import { useState, type ReactNode } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Persona } from '@/components/persona'

/**
 * A phrase in the /listening prose that opens the Spotify Wrapped card from
 * the sumika year. `children` are the words that get the underline, so each
 * of them can lead into it with his own sentence.
 */
export function SumikaDialog({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                // Same look as LinkButton, so the two links in the prose read as a pair
                className="text-left font-medium text-foreground underline decoration-accent/40 decoration-1 underline-offset-4 hover:decoration-accent hover:text-accent transition-colors duration-200"
            >
                {children}
            </button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                {/* The card is twice as tall as it is wide, so let it scroll on a short screen */}
                <DialogContent className="max-w-[300px] max-h-[90vh] overflow-y-auto p-6">
                    <DialogTitle className="text-lg font-semibold">
                        <Persona alen="sumika, wrapped" ban="The receipt" />
                    </DialogTitle>
                    <Image
                        src="/images/sumika-wrapped.png"
                        alt="Spotify Wrapped card. My top artist: sumika. 76,178 minutes listened, top 0.001% of listeners worldwide."
                        width={1080}
                        height={2161}
                        sizes="252px"
                        className="w-full h-auto rounded"
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}
