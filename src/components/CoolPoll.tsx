'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '@/trpc/react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
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
    initialData: PollData
}

const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

export default function CoolPoll({ initialData }: CoolPollProps) {
    const [voteData, setVoteData] = useLocalStorage<VoteData>('coolPollVoted', {
        hasVoted: false,
        timestamp: null
    })
    const [optimisticData, setOptimisticData] = useState<PollData | null>(null)
    const utils = api.useUtils()

    // Check if vote has expired
    const hasVoteExpired = voteData.timestamp && Date.now() - voteData.timestamp > WEEK_IN_MS
    const canVote = !voteData.hasVoted || hasVoteExpired

    // Reset vote if expired
    useEffect(() => {
        if (hasVoteExpired) {
            setVoteData({
                hasVoted: false,
                timestamp: null
            })
        }
    }, [hasVoteExpired, setVoteData])

    const { data: serverData } = api.poll.getCoolPoll.useQuery(undefined, {
        initialData
    })

    const handleVote = (option: 'positive' | 'negative') => {
        if (!canVote) return

        const newData = {
            positive: pollData.positive + (option === 'positive' ? 1 : 0),
            negative: pollData.negative + (option === 'negative' ? 1 : 0)
        }
        setOptimisticData(newData)
        setVoteData({
            hasVoted: true,
            timestamp: Date.now(),
            vote: option
        })
        vote({ option })
    }

    const { mutate: vote } = api.poll.coolVote.useMutation({
        onSuccess: () => {
            void utils.poll.getCoolPoll.invalidate()
        }
    })

    const pollData = optimisticData || serverData
    const totalVotes = pollData.positive + pollData.negative
    const positivePercentage = totalVotes > 0 ? (pollData.positive / totalVotes) * 100 : 50
    const negativePercentage = totalVotes > 0 ? (pollData.negative / totalVotes) * 100 : 50

    const getResultMessage = () => {
        const diff = Math.abs(positivePercentage - negativePercentage)
        const isClose = diff < 5 // Within 5% difference
        const isPositiveMajority = positivePercentage > negativePercentage
        if (!voteData.vote) {
            return isPositiveMajority ? "Hee-ho!" : 'Looks like we hit a weakness...'
        }

        if (isClose) {
            if (voteData.vote === 'positive') return 'Jack Frost approves'
            return 'Mara would be proud of that criticism.'
        }

        if (voteData.vote === 'positive') {
            return isPositiveMajority ? 'ONE MORE GOD REJECTED!' : 'A lone Samurai stands against the horde...'
        } else {
            return isPositiveMajority ? "I mean, I guess it's not that bad..." : 'The negotiations were short...'
        }
    }

    return (
        <div className="w-full max-w-sm space-y-6 rounded-xl p-6">
            {canVote ? (
                <div className="flex justify-center gap-8">
                    <button
                        onClick={() => handleVote('positive')}
                        className="text-lg font-medium underline decoration-green-500 decoration-2 underline-offset-4 hover:text-green-500 transition-colors"
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => handleVote('negative')}
                        className="text-lg font-medium underline decoration-green-500 decoration-2 underline-offset-4 hover:text-green-500 transition-colors"
                    >
                        No
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex justify-between text-sm mb-1">
                        <div className="text-green-500 font-medium">Yes</div>
                        <div className="text-red-500 font-medium">No</div>
                    </div>

                    <div className="relative h-8 bg-muted rounded-lg overflow-hidden">
                        <motion.div
                            className="absolute h-full bg-green-500 left-0"
                            initial={{ width: '0%' }}
                            animate={{ width: `${positivePercentage}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                        <motion.div
                            className="absolute h-full bg-red-500 right-0"
                            initial={{ width: '0%' }}
                            animate={{ width: `${negativePercentage}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                        <div className="absolute inset-0 flex justify-between px-3 items-center text-xs font-medium">
                            <span className="text-white">
                                {pollData.positive} ({positivePercentage.toFixed(1)}%)
                            </span>
                            <span className="text-white">
                                {pollData.negative} ({negativePercentage.toFixed(1)}%)
                            </span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-center text-sm text-muted-foreground">Total votes: {totalVotes}</p>
                        <p className="text-center text-xl font-bold">{getResultMessage()}</p>
                    </div>
                </div>
            )}
        </div>
    )
}
