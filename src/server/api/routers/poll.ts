import { db } from '@/server/db'
import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'

export const pollRouter = createTRPCRouter({
    getCoolPoll: publicProcedure.query(async () => {
        const poll = await db.binaryPoll.findUnique({ where: { name: 'cool' } })
        if (!poll) {
            return { positive: 0, negative: 0 }
        }
        return { positive: poll.positive, negative: poll.negative }
    }),

    coolVote: publicProcedure
        .input(z.object({ option: z.enum(['positive', 'negative']) }))
        .mutation(async ({ input }) => {
            const poll = await db.binaryPoll.findUnique({ where: { name: 'cool' } })
            if (!poll) {
                await db.binaryPoll.create({ data: { name: 'cool' } })
            }
            const update = {
                positive: poll?.positive || 0,
                negative: poll?.negative || 0
            }
            if (input.option === 'positive') {
                update.positive += 1
            } else {
                update.negative += 1
            }
            await db.binaryPoll.update({ where: { name: 'cool' }, data: update })
            return update
        })
})
