'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '@/trpc/react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

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
            return isPositiveMajority ? 'As expected' : 'Gotta work on that'
        }

        if (isClose) {
            if (voteData.vote === 'positive') return 'Thank you really needed that'
            return 'WHY WOULD YOU DO THAT??????'
        }

        if (voteData.vote === 'positive') {
            return isPositiveMajority ? "Let's goooooo" : 'You made the connect choice...unlike the rest of the world'
        } else {
            return isPositiveMajority ? 'Trying to stand out?' : 'WHAT DID I DO WRONG????'
        }
    }

    return (
        <div className="w-full max-w-sm space-y-4 rounded-xl bg-background p-6">
            <div className="relative h-16 overflow-hidden rounded-lg">
                {canVote ? (
                    <>
                        <div
                            className="absolute inset-y-0 left-0 flex w-1/2 cursor-pointer items-center justify-center border-r border-background bg-primary hover:opacity-90"
                            onClick={() => handleVote('positive')}
                        >
                            <span className="z-10 text-xl font-bold text-primary-foreground">Indeed</span>
                        </div>
                        <div
                            className="absolute inset-y-0 right-0 flex w-1/2 cursor-pointer items-center justify-center border-l border-background bg-secondary hover:opacity-90"
                            onClick={() => handleVote('negative')}
                        >
                            <span className="z-10 text-xl font-bold text-secondary-foreground">Erm</span>
                        </div>
                    </>
                ) : (
                    <>
                        <motion.div
                            className="absolute inset-y-0 left-0 flex items-center justify-center border-r border-background bg-primary"
                            initial={{ width: '50%' }}
                            animate={{ width: `${positivePercentage}%` }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="z-10 text-xl font-bold text-primary-foreground">Yes</span>
                        </motion.div>
                        <motion.div
                            className="absolute inset-y-0 right-0 flex items-center justify-center border-l border-background bg-secondary"
                            initial={{ width: '50%' }}
                            animate={{ width: `${negativePercentage}%` }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="z-10 text-xl font-bold text-secondary-foreground">No</span>
                        </motion.div>
                    </>
                )}
            </div>
            {!canVote && (
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <div>
                            {pollData.positive} vote{pollData.positive !== 1 ? 's' : ''} (
                            {positivePercentage.toFixed(1)}%)
                        </div>
                        <div>
                            {pollData.negative} vote{pollData.negative !== 1 ? 's' : ''} (
                            {negativePercentage.toFixed(1)}%)
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
