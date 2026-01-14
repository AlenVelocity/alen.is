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
            return isPositiveMajority ? "Hee-ho!" : 'Looks like we hit a weakness...'
        }
        if (isClose) {
            return voteData.vote === 'positive' ? 'Jack Frost approves' : 'Mara would be proud of that criticism.'
        }
        if (voteData.vote === 'positive') {
            return isPositiveMajority ? 'ONE MORE GOD REJECTED!' : 'A lone Samurai stands against the horde...'
        }
        return isPositiveMajority ? "I mean, I guess it's not that bad..." : 'The negotiations were short...'
    }

    return (
        <div className="w-full max-w-sm space-y-6 p-6">
            {canVote ? (
                <div className="flex justify-center gap-8">
                    <button
                        onClick={() => handleVote('positive')}
                        className="text-lg font-medium underline decoration-accent/50 decoration-2 underline-offset-4 hover:decoration-accent transition-colors"
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => handleVote('negative')}
                        className="text-lg font-medium underline decoration-accent/50 decoration-2 underline-offset-4 hover:decoration-accent transition-colors"
                    >
                        No
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-accent font-medium">Yes</span>
                        <span className="text-destructive font-medium">No</span>
                    </div>

                    <div className="relative h-8 bg-muted rounded-lg overflow-hidden">
                        <motion.div
                            className="absolute h-full bg-accent left-0"
                            initial={{ width: '0%' }}
                            animate={{ width: `${positivePercentage}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                        <motion.div
                            className="absolute h-full bg-destructive right-0"
                            initial={{ width: '0%' }}
                            animate={{ width: `${negativePercentage}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                        <div className="absolute inset-0 flex justify-between px-3 items-center text-xs font-medium">
                            <span className="text-accent-foreground">{pollData.positive} ({positivePercentage.toFixed(1)}%)</span>
                            <span className="text-destructive-foreground">{pollData.negative} ({negativePercentage.toFixed(1)}%)</span>
                        </div>
                    </div>

                    <div className="space-y-1 text-center">
                        <p className="text-sm text-muted-foreground">Total votes: {totalVotes}</p>
                        <p className="text-lg font-semibold">{getResultMessage()}</p>
                    </div>
                </div>
            )}
        </div>
    )
}
