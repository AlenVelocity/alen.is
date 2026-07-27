import { db } from '@/server/db'
import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'

/** Ceiling on a single reader's boosts for one post, matching the client's cap */
export const MAX_BOOSTS_PER_READER = 50

/**
 * Signal boosts on blog posts — this site's take on Medium's clap.
 *
 * Deliberately write-only: there is no query to read totals. Hiding the number
 * in the UI while still serving it from the API would leave it a fetch away
 * from public, so the endpoint simply doesn't exist yet. Read the counts with
 * `pnpm db:studio`; add a query here when they're worth showing.
 */
export const signalsRouter = createTRPCRouter({
    boost: publicProcedure
        .input(
            z.object({
                slug: z
                    .string()
                    .min(1)
                    .max(200)
                    // Matches the filenames in src/content/blog
                    .regex(/^[a-z0-9-]+$/i),
                /** Boosts accumulated client-side since the last flush */
                amount: z.number().int().min(1).max(MAX_BOOSTS_PER_READER)
            })
        )
        .mutation(async ({ input }) => {
            await db.postSignal.upsert({
                where: { slug: input.slug },
                create: { slug: input.slug, count: input.amount },
                update: { count: { increment: input.amount } }
            })
            // No count returned — see the note above
            return { ok: true }
        })
})
