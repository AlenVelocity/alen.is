'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '@/trpc/react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { posthog } from '@/components/posthog-provider'

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
    initialData: PollData
}

const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000

export default function CoolPoll({ initialData }: CoolPollProps) {
    const [voteData, setVoteData] = useLocalStorage<VoteData>('coolPollVoted', {
        hasVoted: false,
        timestamp: null
    })
    const [optimisticData, setOptimisticData] = useState<PollData | null>(null)
    const utils = api.useUtils()

    const hasVoteExpired = voteData.timestamp && Date.now() - voteData.timestamp > WEEK_IN_MS
    const canVote = !voteData.hasVoted || hasVoteExpired

    useEffect(() => {
        if (hasVoteExpired) {
            setVoteData({ hasVoted: false, timestamp: null })
        }
    }, [hasVoteExpired, setVoteData])

    const { data: serverData } = api.poll.getCoolPoll.useQuery(undefined, { initialData })

    const handleVote = (option: 'positive' | 'negative') => {
        if (!canVote) return
        const newData = {
            positive: pollData.positive + (option === 'positive' ? 1 : 0),
            negative: pollData.negative + (option === 'negative' ? 1 : 0)
        }
        setOptimisticData(newData)
        setVoteData({ hasVoted: true, timestamp: Date.now(), vote: option })
        vote({ option })
        posthog.capture('poll_vote', { poll: 'cool', vote: option === 'positive' ? 'yes' : 'no' })
    }

    const { mutate: vote } = api.poll.coolVote.useMutation({
        onSuccess: () => void utils.poll.getCoolPoll.invalidate()
    })

    const pollData = optimisticData || serverData
    const totalVotes = pollData.positive + pollData.negative
    const positivePercentage = totalVotes > 0 ? (pollData.positive / totalVotes) * 100 : 50
    const negativePercentage = totalVotes > 0 ? (pollData.negative / totalVotes) * 100 : 50

    const getResultMessage = () => {
        const diff = Math.abs(positivePercentage - negativePercentage)
        const isClose = diff < 5
        const isPositiveMajority = positivePercentage > negativePercentage

        if (!voteData.vote) {
            return isPositiveMajority ? 'the people have spoken.' : 'controversial.'
        }
        if (isClose) {
            return "it's close."
        }
        if (voteData.vote === 'positive') {
            return isPositiveMajority ? 'glad you think so.' : 'a lone voice in the crowd.'
        }
        return isPositiveMajority ? 'noted, respectfully.' : 'fair enough.'
    }

    return (
        <div className="w-full space-y-5">
            {canVote ? (
                <div className="flex justify-center gap-8">
                    <button
                        onClick={() => handleVote('positive')}
                        className="text-display text-2xl text-accent hover:text-accent border-b border-transparent hover:border-accent transition-all duration-200 active:scale-95 pb-0.5"
                    >
                        yes
                    </button>
                    <span className="mono-label text-muted-foreground/25 text-2xl">/</span>
                    <button
                        onClick={() => handleVote('negative')}
                        className="text-display text-2xl text-muted-foreground hover:text-destructive border-b border-transparent hover:border-destructive/50 transition-all duration-200 active:scale-95 pb-0.5"
                    >
                        no
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex justify-between mono-label text-muted-foreground/50 mb-2">
                        <span className="text-accent">yes</span>
                        <span>{totalVotes} votes</span>
                        <span className="text-destructive">no</span>
                    </div>

                    {/* Progress bar — sharp corners */}
                    <div className="relative h-6 bg-muted overflow-hidden rounded-sm">
                        <motion.div
                            className="absolute h-full bg-accent left-0"
                            initial={{ width: '0%' }}
                            animate={{ width: `${positivePercentage}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                        <motion.div
                            className="absolute h-full bg-destructive/70 right-0"
                            initial={{ width: '0%' }}
                            animate={{ width: `${negativePercentage}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                        <div className="absolute inset-0 flex justify-between px-2.5 items-center mono-label text-background mix-blend-difference">
                            <span>{positivePercentage.toFixed(0)}%</span>
                            <span>{negativePercentage.toFixed(0)}%</span>
                        </div>
                    </div>

                    <p className="text-display text-base text-center">{getResultMessage()}</p>
                </div>
            )}
        </div>
    )
}
