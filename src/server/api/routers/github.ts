import { createTRPCRouter, publicProcedure } from '../trpc'

const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? ''
const GITHUB_USERNAME = 'AlenVelocity'

interface ContributionDay {
    date: string
    contributionCount: number
    color: string
}

const GITHUB_GRAPHQL_QUERY = `
query($username: String!) {
    user(login: $username) {
        contributionsCollection {
            totalCommitContributions
            totalPullRequestContributions
            totalIssueContributions
            totalRepositoryContributions
            restrictedContributionsCount
            contributionCalendar {
                totalContributions
                weeks {
                    contributionDays {
                        date
                        contributionCount
                        color
                    }
                }
            }
        }
        repositories(first: 100, ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC) {
            nodes {
                languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                    edges {
                        size
                        node {
                            name
                            color
                        }
                    }
                }
            }
        }
    }
}
`

export const githubRouter = createTRPCRouter({
    getStats: publicProcedure.query(async () => {
        try {
            const response = await fetch('https://api.github.com/graphql', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: GITHUB_GRAPHQL_QUERY,
                    variables: { username: GITHUB_USERNAME }
                }),
                next: { revalidate: 3600 } // Cache for 1 hour
            })

            if (!response.ok) {
                throw new Error('Failed to fetch GitHub data')
            }

            const data = await response.json()
            
            if (data.errors) {
                console.error('GitHub API errors:', data.errors)
                throw new Error('GitHub API error')
            }

            const user = data.data.user
            const contributions = user.contributionsCollection
            const calendar = contributions.contributionCalendar

            // Get contribution days for the graph (last 52 weeks)
            const contributionDays: ContributionDay[] = calendar.weeks
                .flatMap((week: { contributionDays: ContributionDay[] }) => week.contributionDays)

            // Calculate streak
            let currentStreak = 0
            let longestStreak = 0
            let tempStreak = 0
            const today = new Date().toISOString().split('T')[0]
            
            // Reverse to start from most recent
            const sortedDays = [...contributionDays].reverse()
            for (const day of sortedDays) {
                if (day.contributionCount > 0) {
                    tempStreak++
                    if (day.date === today || currentStreak > 0) {
                        currentStreak = tempStreak
                    }
                } else {
                    if (tempStreak > longestStreak) longestStreak = tempStreak
                    tempStreak = 0
                    if (currentStreak > 0) break // Stop counting current streak after a gap
                }
            }
            if (tempStreak > longestStreak) longestStreak = tempStreak

            // Aggregate languages across all repos
            const languageMap = new Map<string, { size: number; color: string }>()
            for (const repo of user.repositories.nodes) {
                for (const edge of repo.languages?.edges || []) {
                    const lang = edge.node.name
                    const existing = languageMap.get(lang)
                    if (existing) {
                        existing.size += edge.size
                    } else {
                        languageMap.set(lang, { size: edge.size, color: edge.node.color })
                    }
                }
            }

            // Sort by size and get top languages
            const totalSize = Array.from(languageMap.values()).reduce((acc, l) => acc + l.size, 0)
            const topLanguages = Array.from(languageMap.entries())
                .sort((a, b) => b[1].size - a[1].size)
                .slice(0, 8)
                .map(([name, data]) => ({
                    name,
                    color: data.color,
                    percentage: Math.round((data.size / totalSize) * 100)
                }))

            // Include private contributions in total
            const privateContributions = contributions.restrictedContributionsCount || 0
            const totalWithPrivate = calendar.totalContributions + privateContributions

            return {
                totalContributions: totalWithPrivate,
                commits: contributions.totalCommitContributions,
                pullRequests: contributions.totalPullRequestContributions,
                issues: contributions.totalIssueContributions,
                currentStreak,
                longestStreak,
                contributionDays: contributionDays.slice(-365), // Last year
                topLanguages,
                username: GITHUB_USERNAME
            }
        } catch (error) {
            console.error('Error fetching GitHub data:', error)
            throw new Error('Failed to fetch GitHub data')
        }
    })
})

