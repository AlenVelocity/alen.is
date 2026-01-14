import { createTRPCRouter, publicProcedure } from '../trpc'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? ''
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? ''
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN ?? ''

interface ActivitySession {
    id: string
    name: string
    description: string
    activityType: number
    startTime: Date
    endTime: Date
    durationMinutes: number
}

interface DailySummary {
    date: string
    steps: number
    calories: number
    activeMinutes: number
    distance: number // in meters
}

// Activity type mapping (subset of Google Fit activity types)
const ACTIVITY_NAMES: Record<number, string> = {
    7: 'Walking',
    8: 'Running',
    9: 'Cycling',
    13: 'Dancing',
    80: 'Weight Training',
    97: 'Strength Training',
    98: 'CrossFit',
    115: 'Elliptical',
    3: 'Still',
    72: 'Sleep',
    82: 'Yoga',
    29: 'Swimming',
    116: 'Pilates',
    37: 'HIIT',
    120: 'Rowing Machine',
    1: 'Biking',
    4: 'Unknown',
}

async function getAccessToken(): Promise<string> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            refresh_token: GOOGLE_REFRESH_TOKEN,
            grant_type: 'refresh_token',
        }),
    })

    if (!response.ok) {
        throw new Error('Failed to refresh access token')
    }

    const data = await response.json()
    return data.access_token
}

export const fitnessRouter = createTRPCRouter({
    getStats: publicProcedure.query(async () => {
        try {
            if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
                throw new Error('Google Fit credentials not configured')
            }

            const accessToken = await getAccessToken()

            // Get data for the last 30 days
            const now = Date.now()
            const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000
            const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000

            // Fetch activity sessions (workouts)
            const sessionsResponse = await fetch(
                `https://www.googleapis.com/fitness/v1/users/me/sessions?startTime=${new Date(thirtyDaysAgo).toISOString()}&endTime=${new Date(now).toISOString()}`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    next: { revalidate: 1800 } // Cache for 30 minutes
                }
            )

            if (!sessionsResponse.ok) {
                console.error('Sessions API error:', await sessionsResponse.text())
                throw new Error('Failed to fetch activity sessions')
            }

            const sessionsData = await sessionsResponse.json()

            // Filter and map sessions to workouts
            const workouts: ActivitySession[] = (sessionsData.session || [])
                .filter((session: any) => {
                    // Filter out sleep, still, and unknown activities
                    const type = session.activityType
                    return type !== 72 && type !== 3 && type !== 4
                })
                .map((session: any) => {
                    const startTime = new Date(parseInt(session.startTimeMillis))
                    const endTime = new Date(parseInt(session.endTimeMillis))
                    const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000)

                    return {
                        id: session.id,
                        name: session.name || ACTIVITY_NAMES[session.activityType] || 'Workout',
                        description: session.description || '',
                        activityType: session.activityType,
                        startTime,
                        endTime,
                        durationMinutes,
                    }
                })
                .sort((a: ActivitySession, b: ActivitySession) => b.startTime.getTime() - a.startTime.getTime())
                .slice(0, 10) // Last 10 workouts

            // Fetch aggregate data for steps, calories, distance
            const aggregateResponse = await fetch(
                'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        aggregateBy: [
                            { dataTypeName: 'com.google.step_count.delta' },
                            { dataTypeName: 'com.google.calories.expended' },
                            { dataTypeName: 'com.google.heart_minutes' },
                            { dataTypeName: 'com.google.distance.delta' },
                        ],
                        bucketByTime: { durationMillis: 86400000 }, // 1 day
                        startTimeMillis: sevenDaysAgo,
                        endTimeMillis: now,
                    }),
                    next: { revalidate: 1800 }
                }
            )

            if (!aggregateResponse.ok) {
                console.error('Aggregate API error:', await aggregateResponse.text())
                throw new Error('Failed to fetch aggregate data')
            }

            const aggregateData = await aggregateResponse.json()
            
            // Debug: log ALL buckets
            console.log('Google Fit buckets:', aggregateData.bucket?.length || 0)
            for (let i = 0; i < (aggregateData.bucket?.length || 0); i++) {
                const bucket = aggregateData.bucket[i]
                const date = new Date(parseInt(bucket.startTimeMillis)).toISOString().split('T')[0]
                const datasets = bucket.dataset?.map((d: any) => ({
                    sourceId: d.dataSourceId?.split(':')[1] || d.dataSourceId,
                    points: d.point?.length || 0,
                    values: d.point?.slice(0, 2).map((p: any) => p.value) || []
                }))
                console.log(`Bucket ${i} (${date}):`, JSON.stringify(datasets, null, 2))
            }

            // Process daily summaries
            const dailySummaries: DailySummary[] = (aggregateData.bucket || []).map((bucket: any) => {
                const date = new Date(parseInt(bucket.startTimeMillis)).toISOString().split('T')[0]
                let steps = 0, calories = 0, activeMinutes = 0, distance = 0

                for (const dataset of bucket.dataset || []) {
                    const sourceId = dataset.dataSourceId?.toLowerCase() || ''
                    
                    for (const point of dataset.point || []) {
                        for (const value of point.value || []) {
                            const numValue = value.intVal ?? value.fpVal ?? 0
                            
                            if (sourceId.includes('step_count') || sourceId.includes('step')) {
                                steps += Math.round(numValue)
                            } else if (sourceId.includes('calories') || sourceId.includes('calorie')) {
                                calories += Math.round(numValue)
                            } else if (sourceId.includes('active_minutes') || sourceId.includes('heart_minutes') || sourceId.includes('activity.segment')) {
                                activeMinutes += Math.round(numValue)
                            } else if (sourceId.includes('distance')) {
                                distance += numValue
                            }
                        }
                    }
                }

                return { date, steps, calories, activeMinutes, distance: Math.round(distance) }
            })

            // Calculate totals and averages
            const weeklyStats = dailySummaries.reduce(
                (acc, day) => ({
                    totalSteps: acc.totalSteps + day.steps,
                    totalCalories: acc.totalCalories + day.calories,
                    totalActiveMinutes: acc.totalActiveMinutes + day.activeMinutes,
                    totalDistance: acc.totalDistance + day.distance,
                }),
                { totalSteps: 0, totalCalories: 0, totalActiveMinutes: 0, totalDistance: 0 }
            )

            // Calculate workout streak
            const workoutDates = new Set(
                workouts.map((w) => w.startTime.toISOString().split('T')[0])
            )
            let workoutStreak = 0
            const today = new Date()
            for (let i = 0; i < 30; i++) {
                const checkDate = new Date(today)
                checkDate.setDate(today.getDate() - i)
                const dateStr = checkDate.toISOString().split('T')[0]
                if (workoutDates.has(dateStr)) {
                    workoutStreak++
                } else if (i > 0) {
                    break
                }
            }

            return {
                workouts: workouts.map((w) => ({
                    ...w,
                    startTime: w.startTime.toISOString(),
                    endTime: w.endTime.toISOString(),
                    activityName: ACTIVITY_NAMES[w.activityType] || 'Workout',
                })),
                dailySummaries,
                weeklyStats: {
                    ...weeklyStats,
                    avgSteps: Math.round(weeklyStats.totalSteps / Math.max(dailySummaries.length, 1)),
                    avgCalories: Math.round(weeklyStats.totalCalories / Math.max(dailySummaries.length, 1)),
                },
                workoutStreak,
                totalWorkouts: workouts.length,
            }
        } catch (error) {
            console.error('Error fetching Google Fit data:', error)
            throw new Error('Failed to fetch fitness data')
        }
    }),
})

