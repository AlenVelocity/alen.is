'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const agreeingResponses = [
    "You're absolutely right!",
    "Couldn't agree more.",
    "That's exactly what I was thinking!",
    'You took the words right out of my mouth.',
    'Finally, someone who gets it!',
    "This is the most correct thing I've heard all day.",
    "You're speaking my language!",
    "I've never agreed with anything more in my life.",
    'This is the way.',
    "You're onto something here!",
    'Brilliant observation!',
    'My thoughts exactly!',
    "You've nailed it!",
    '100% with you on this one.',
    'This person gets it!',
    'Truer words have never been spoken.',
    "You're preaching to the choir!",
    "Now that's what I call wisdom!",
    'Absolutely spot on!',
    "You're reading my mind!"
]

const disagreeingResponses = [
    "No way, you've got to be kidding.",
    "I'm going to have to disagree with you there.",
    'Have you really thought this through?',
    "That's the most ridiculous thing I've ever heard.",
    'Are we even on the same planet right now?',
    "I couldn't disagree more if I tried.",
    "You can't be serious right now.",
    'Did you actually just say that?',
    "That's a hard no from me.",
    'Not in a million years.',
    'You might want to reconsider that.',
    'Who told you that was a good idea?',
    'I think you need to sleep on this one.',
    "That's gonna be a no from me, dawg.",
    'Is this some kind of joke?',
    "You've lost me completely.",
    'What universe are you living in?',
    "This ain't it, chief.",
    "I'm literally speechless right now.",
    'Did we attend the same meeting?'
]

export default function NotFound() {
    const [response, setResponse] = useState('')
    const [isAgreeing, setIsAgreeing] = useState(true)
    const [extraLetters, setExtraLetters] = useState('')
    const [exclamations, setExclamations] = useState('')
    const [questions, setQuestions] = useState('')

    useEffect(() => {
        const responses = Math.random() > 0.5 ? agreeingResponses : disagreeingResponses
        setIsAgreeing(responses === agreeingResponses)
        const randomIndex = Math.floor(Math.random() * responses.length)
        setResponse(responses[randomIndex] as string)

        const repeatCount = Math.floor(Math.random() * 6) // 0 to 5
        const letterToRepeat = responses === agreeingResponses ? 'S' : 'O'
        setExtraLetters(letterToRepeat.repeat(repeatCount))

        const exclamationCount = Math.floor(Math.random() * 4) // 0 to 3
        setExclamations('!'.repeat(exclamationCount))

        const questionCount = responses === disagreeingResponses ? Math.floor(Math.random() * 3) : 0 // 0 to 2 for NO only
        setQuestions('?'.repeat(questionCount))
    }, [])

    return (
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center">
            <motion.div
                key={Math.random()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center space-y-8 text-center"
            >
                <motion.h1
                    className="text-8xl font-bold"
                    animate={{
                        rotate: [0, -5, 5, -5, 0],
                        transition: { duration: 0.5, delay: 0.2 }
                    }}
                >
                    {isAgreeing ? `YES${extraLetters}${exclamations}` : `NO${extraLetters}${exclamations}${questions}`}
                </motion.h1>
                <motion.p
                    className="max-w-md text-xl text-muted-foreground"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                >
                    {response}
                </motion.p>
            </motion.div>
        </div>
    )
}
