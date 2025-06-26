import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getBg = (index: number) => {
    const colors = [
        'bg-gradient-to-br from-blue-400 to-purple-600 dark:from-blue-500 dark:to-purple-700',
        'bg-gradient-to-br from-pink-400 to-red-600 dark:from-pink-500 dark:to-red-700',
        'bg-gradient-to-br from-green-400 to-blue-600 dark:from-green-500 dark:to-blue-700',
        'bg-gradient-to-br from-yellow-400 to-orange-600 dark:from-yellow-500 dark:to-orange-700',
        'bg-gradient-to-br from-purple-400 to-pink-600 dark:from-purple-500 dark:to-pink-700',
        'bg-gradient-to-br from-indigo-400 to-cyan-600 dark:from-indigo-500 dark:to-cyan-700'
    ]
    return colors[index % colors.length]
}
