import { useState, useEffect } from 'react'

export const useCounter = (end: number, startDelay: number = 0) => {
    const [count, setCount] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isAnimating) {
                setIsAnimating(true)
                const start = 0
                const step = end / (2000 / 16) // 2 seconds duration at 60fps
                let current = start

                const updateCount = () => {
                    current += step
                    if (current < end) {
                        setCount(Math.floor(current))
                        requestAnimationFrame(updateCount)
                    } else {
                        setCount(end)
                        setIsAnimating(false)
                    }
                }

                requestAnimationFrame(updateCount)
            }
        }, startDelay)

        return () => clearTimeout(timer)
    }, [end, startDelay])

    return count
}
