import { z } from 'zod'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '@/server/api/trpc'
import { db } from '@/server/db'

export const reviewsRouter = createTRPCRouter({
    getReview: publicProcedure
        .input(z.object({
            entityId: z.string(),
            type: z.enum(['GAME', 'SONG'])
        }))
        .query(async ({ input }) => {
            const review = await db.review.findUnique({
                where: {
                    entityId_type: {
                        entityId: input.entityId,
                        type: input.type
                    }
                }
            })
            return review
        }),

    getReviewsByType: publicProcedure
        .input(z.object({
            type: z.enum(['GAME', 'SONG'])
        }))
        .query(async ({ input }) => {
            return db.review.findMany({
                where: { type: input.type },
                orderBy: { updatedAt: 'desc' }
            })
        }),

    upsertReview: protectedProcedure
        .input(z.object({
            entityId: z.string(),
            type: z.enum(['GAME', 'SONG']),
            name: z.string().optional(),
            image: z.string().nullable().optional(),
            rating: z.number().min(1).max(10).nullable().optional(),
            content: z.string(),
        }))
        .mutation(async ({ input }) => {
            const { entityId, type, name, image, rating, content } = input
            
            return db.review.upsert({
                where: {
                    entityId_type: {
                        entityId,
                        type
                    }
                },
                update: {
                    rating: rating === undefined ? null : rating,
                    content,
                    ...(name !== undefined && { name }),
                    ...(image !== undefined && { image }),
                },
                create: {
                    entityId,
                    type,
                    name: name || '',
                    image: image || null,
                    rating: rating === undefined ? null : rating,
                    content
                }
            })
        }),
        
    deleteReview: protectedProcedure
        .input(z.object({
            entityId: z.string(),
            type: z.enum(['GAME', 'SONG']),
        }))
        .mutation(async ({ input }) => {
            return db.review.delete({
                where: {
                    entityId_type: {
                        entityId: input.entityId,
                        type: input.type
                    }
                }
            })
        })
})
