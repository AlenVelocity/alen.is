import { createCallerFactory, createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { pollRouter } from './routers/poll'
import { lastFmRouter } from './routers/lastfm'
import { spotifyRouter } from './routers/spotify'
import { gamingRouter } from './routers/gaming'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    lastfm: lastFmRouter,
    poll: pollRouter,
    spotify: spotifyRouter,
    gaming: gamingRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter)
