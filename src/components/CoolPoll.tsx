'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '@/trpc/react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { posthog } from '@/components/posthog-provider'
import { Persona } from '@/components/persona'
import { cn } from '@/lib/utils'

interface PollData {
    positive: number
    negative: number
}

interface VoteData {
    hasVoted: boolean
    timestamp: number | null
    vote?: 'positive' | 'negative'
}

interface CoolPollProps {
    /** null when the server could not read the count. The poll then asks again from the browser. */
    initialData: PollData | null
}

const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000

/** One plain line, for when there is something to say instead of (or under) the poll */
const NOTE = 'mono-label text-muted-foreground/60 text-center'

const BAR_TRANSITION = { duration: 0.45, ease: 'easeOut' } as const

/**
 * The yes/no poll on /cool. Alen asked, so he reads the count as an answer.
 * Ban did not ask: to him the poll changes nothing, a "no" is just wrong,
 * and a count that goes against him means the poll is broken.
 */
export default function CoolPoll({ initialData }: CoolPollProps) {
    const [voteData, setVoteData] = useLocalStorage<VoteData>('coolPollVoted', {
        hasVoted: false,
        timestamp: null
    })
    const [optimisticData, setOptimisticData] = useState<PollData | null>(null)
    const [voteFailed, setVoteFailed] = useState(false)
    // The stored vote is only read after mount. Hold the poll hidden until then so
    // returning voters don't see the vote buttons flash before their results
    const [ready, setReady] = useState(false)
    useEffect(() => setReady(true), [])
    const utils = api.useUtils()

    const hasVoteExpired = voteData.timestamp && Date.now() - voteData.timestamp > WEEK_IN_MS
    const canVote = !voteData.hasVoted || hasVoteExpired

    useEffect(() => {
        if (hasVoteExpired) {
            setVoteData({ hasVoted: false, timestamp: null })
        }
    }, [hasVoteExpired, setVoteData])

    const { data: serverData, isError } = api.poll.getCoolPoll.useQuery(undefined, {
        initialData: initialData ?? undefined
    })

    const { mutate: vote } = api.poll.coolVote.useMutation({
        onSuccess: () => void utils.poll.getCoolPoll.invalidate(),
        // The vote never landed: take it back off the count and let them vote again
        onError: () => {
            setOptimisticData(null)
            setVoteData({ hasVoted: false, timestamp: null })
            setVoteFailed(true)
        }
    })

    const pollData = optimisticData || serverData

    // No count yet (the server could not read it and the browser is asking), or none at all
    if (!pollData) {
        return (
            <div className="w-full min-h-[5.75rem] flex flex-col justify-center">
                <p className={NOTE} role="status">
                    {isError ? (
                        <Persona alen="can't reach the poll right now." ban="The poll is down. I'm still cool." />
                    ) : (
                        <Persona alen="counting the votes" ban="Counting." />
                    )}
                </p>
            </div>
        )
    }

    const totalVotes = pollData.positive + pollData.negative
    const positivePercentage = totalVotes > 0 ? (pollData.positive / totalVotes) * 100 : 50
    const negativePercentage = totalVotes > 0 ? (pollData.negative / totalVotes) * 100 : 50

    const handleVote = (option: 'positive' | 'negative') => {
        if (!canVote) return
        setVoteFailed(false)
        setOptimisticData({
            positive: pollData.positive + (option === 'positive' ? 1 : 0),
            negative: pollData.negative + (option === 'negative' ? 1 : 0)
        })
        setVoteData({ hasVoted: true, timestamp: Date.now(), vote: option })
        vote({ option })
        posthog.capture('poll_vote', { poll: 'cool', vote: option === 'positive' ? 'yes' : 'no' })
    }

    /** What each of them makes of the count. Same numbers, two readings. */
    const getVerdict = (): { alen: string; ban: string } => {
        const isClose = Math.abs(positivePercentage - negativePercentage) < 5
        const yesLeads = positivePercentage > negativePercentage

        if (!voteData.vote) {
            return yesLeads
                ? { alen: 'the people have spoken.', ban: "Didn't need the poll." }
                : { alen: 'people are split.', ban: 'The poll is broken.' }
        }
        if (isClose) {
            return { alen: "it's close.", ban: "It's not close." }
        }
        if (voteData.vote === 'positive') {
            return yesLeads
                ? { alen: 'glad you think so.', ban: 'Correct.' }
                : { alen: "thanks. you're outnumbered tho.", ban: 'Correct. The poll is broken.' }
        }
        return yesLeads ? { alen: 'ok. noted.', ban: 'Wrong.' } : { alen: 'fair enough.', ban: 'The poll is broken.' }
    }
    const verdict = getVerdict()

    return (
        // Min height covers the taller of the two views, so voting doesn't shove the centred column up
        <div className={cn('w-full min-h-[5.75rem] flex flex-col justify-center', !ready && 'invisible')}>
            {canVote ? (
                <>
                    <div className="flex justify-center gap-8">
                        <button
                            onClick={() => handleVote('positive')}
                            className="text-display text-2xl text-accent border-b border-transparent hover:border-accent transition-[border-color,transform] duration-200 active:scale-95 pb-0.5"
                        >
                            <Persona alen="yes" ban="Yes" />
                        </button>
                        <span className="mono-label text-muted-foreground/25 text-2xl">/</span>
                        <button
                            onClick={() => handleVote('negative')}
                            className="text-display text-2xl text-muted-foreground border-b border-transparent hover:border-destructive ban:hover:border-muted-foreground transition-[border-color,transform] duration-200 active:scale-95 pb-0.5"
                        >
                            <Persona alen="no" ban="No" />
                        </button>
                    </div>
                    {voteFailed && (
                        <p className={cn(NOTE, 'mt-3')} role="status">
                            <Persona
                                alen="that vote didn't go through. try again."
                                ban="The poll dropped your vote. Vote again."
                            />
                        </p>
                    )}
                </>
            ) : (
                <div className="space-y-4">
                    {/* The numbers sit above the bar, not on it: text laid over two bar
                        colours cannot stay readable across four palettes */}
                    <div className="flex justify-between mono-label text-muted-foreground/60 mb-2">
                        <span>
                            <span className="text-accent">yes</span> {positivePercentage.toFixed(0)}%
                        </span>
                        <span>
                            {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
                        </span>
                        <span>
                            {negativePercentage.toFixed(0)}%{' '}
                            <span className="text-destructive ban:text-muted-foreground">
                                <Persona alen="no" ban="wrong" />
                            </span>
                        </span>
                    </div>

                    {/* Both bars are absolute inside a fixed-height track, so growing them moves nothing else.
                        Ban's red and his rust sit too close to tell apart, so his "no" is ink grey */}
                    <div className="relative h-6 bg-muted overflow-hidden rounded-sm">
                        <motion.div
                            className="absolute h-full bg-accent left-0"
                            initial={{ width: '0%' }}
                            animate={{ width: `${positivePercentage}%` }}
                            transition={BAR_TRANSITION}
                        />
                        <motion.div
                            className="absolute h-full bg-destructive/70 ban:bg-foreground/25 right-0"
                            initial={{ width: '0%' }}
                            animate={{ width: `${negativePercentage}%` }}
                            transition={BAR_TRANSITION}
                        />
                    </div>

                    <p className="text-display text-base text-center">
                        <Persona alen={verdict.alen} ban={verdict.ban} />
                    </p>
                </div>
            )}
        </div>
    )
}
