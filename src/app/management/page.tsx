'use client'

import { useState, useEffect, useMemo, useCallback, memo } from 'react'
import { api } from '@/trpc/react'
import { FiSave, FiStar, FiTrash2, FiSearch, FiMusic, FiCommand, FiX, FiChevronRight, FiLogOut } from 'react-icons/fi'
import { FaSteam, FaXbox } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { logout } from './login/actions'

// ── Debounce hook ──────────────────────────────────────────────────────────────
function useDebounce(value: string, delay: number) {
    const [debounced, setDebounced] = useState(value)
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(timer)
    }, [value, delay])
    return debounced
}

// ── Review Form (only rendered for a single selected item) ─────────────────────
const ReviewForm = memo(function ReviewForm({ type, entityId, name, image, onClose }: {
    type: 'GAME' | 'SONG'
    entityId: string
    name: string
    image?: string | null
    onClose: () => void
}) {
    const utils = api.useUtils()
    const { data: review, isLoading } = api.reviews.getReview.useQuery({ entityId, type })

    const [rating, setRating] = useState<number | ''>('')
    const [content, setContent] = useState('')
    const [initialized, setInitialized] = useState(false)

    // Properly sync state from fetched review
    useEffect(() => {
        if (review && !initialized) {
            setRating(review.rating ?? '')
            setContent(review.content)
            setInitialized(true)
        }
    }, [review, initialized])

    const upsertMutation = api.reviews.upsertReview.useMutation({
        onSuccess: () => {
            utils.reviews.getReview.invalidate({ entityId, type })
        }
    })

    const deleteMutation = api.reviews.deleteReview.useMutation({
        onSuccess: () => {
            utils.reviews.getReview.invalidate({ entityId, type })
            setRating('')
            setContent('')
            setInitialized(false)
        }
    })

    const handleSave = useCallback(() => {
        if (!content.trim()) return
        upsertMutation.mutate({
            entityId,
            type,
            name,
            image: image || null,
            rating: rating === '' ? undefined : Number(rating),
            content,
        })
    }, [entityId, type, name, image, rating, content, upsertMutation])

    if (isLoading) return <div className="h-28 w-full bg-muted/40 animate-pulse rounded-xl" />

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
        >
            <div className="rounded-xl bg-card border border-accent/20 paper-shadow p-4 md:p-5">
                <div className="flex flex-col md:flex-row gap-4">
                    {image ? (
                        <img src={image} alt={name} className="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover ring-1 ring-border shrink-0" />
                    ) : (
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg bg-muted flex items-center justify-center shrink-0 border border-border">
                            {type === 'GAME' ? <FiCommand className="w-7 h-7 text-muted-foreground/40" /> : <FiMusic className="w-7 h-7 text-muted-foreground/40" />}
                        </div>
                    )}

                    <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-semibold tracking-tight">{name}</h3>
                            <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                                <FiX className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
                                <FiStar className="text-accent w-3.5 h-3.5" />
                            </div>
                            <input
                                type="number"
                                min="1" max="10"
                                placeholder="/ 10"
                                value={rating}
                                onChange={(e) => setRating(e.target.value === '' ? '' : parseInt(e.target.value))}
                                className="bg-background border border-border rounded-lg px-3 py-2 w-24 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm font-medium"
                            />
                        </div>

                        <textarea
                            placeholder="What's the verdict?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 min-h-[80px] resize-y focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-sm leading-relaxed"
                        />

                        <div className="flex items-center gap-2.5">
                            <button
                                onClick={handleSave}
                                disabled={upsertMutation.isPending}
                                className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg text-sm font-semibold hover-lift transition-all"
                            >
                                <FiSave className={upsertMutation.isPending ? "animate-spin" : ""} />
                                {upsertMutation.isPending ? 'Saving...' : (review ? 'Update' : 'Publish')}
                            </button>

                            {review && (
                                <button
                                    onClick={() => deleteMutation.mutate({ entityId, type })}
                                    className="flex items-center gap-2 bg-destructive/10 text-destructive px-3 py-2 rounded-lg text-sm font-medium hover:bg-destructive/20 transition-colors"
                                >
                                    <FiTrash2 className="w-3.5 h-3.5" /> Remove
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
})

// ── Compact list item (no query per item = no re-render cascade) ───────────────
interface ListItem {
    entityId: string
    name: string
    image?: string | null
    subtitle?: string
}

const ItemRow = memo(function ItemRow({ item, isSelected, onSelect, type }: {
    item: ListItem
    isSelected: boolean
    onSelect: (item: ListItem) => void
    type: 'GAME' | 'SONG'
}) {
    return (
        <button
            onClick={() => onSelect(item)}
            className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all text-left group ${isSelected ? 'bg-accent/10 border border-accent/20' : 'hover:bg-muted/40 border border-transparent'}`}
        >
            {item.image ? (
                type === 'GAME' ? (
                    <div className="relative w-20 h-9 rounded overflow-hidden flex-shrink-0 ring-1 ring-border/50 group-hover:ring-accent/30 transition-all">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                ) : (
                    <div className="w-9 h-9 rounded overflow-hidden flex-shrink-0 ring-1 ring-border/50 group-hover:ring-accent/30 transition-all">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                )
            ) : (
                <div className={`${type === 'GAME' ? 'w-20 h-9' : 'w-9 h-9'} rounded bg-muted flex items-center justify-center flex-shrink-0 border border-border/50`}>
                    {type === 'GAME' ? <FiCommand className="w-3.5 h-3.5 text-muted-foreground/40" /> : <FiMusic className="w-3.5 h-3.5 text-muted-foreground/40" />}
                </div>
            )}
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate transition-colors ${isSelected ? 'text-accent' : 'group-hover:text-accent'}`}>{item.name}</p>
                {item.subtitle && <p className="text-xs text-muted-foreground/60 truncate">{item.subtitle}</p>}
            </div>
            <FiChevronRight className={`w-4 h-4 shrink-0 transition-all ${isSelected ? 'text-accent' : 'text-muted-foreground/30 group-hover:text-accent/60 -translate-x-1 group-hover:translate-x-0 opacity-0 group-hover:opacity-100'}`} />
        </button>
    )
})

// ── Admin Dashboard ────────────────────────────────────────────────────────────
function AdminDashboard() {
    const [tab, setTab] = useState<'GAMES' | 'SONGS'>('GAMES')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedItem, setSelectedItem] = useState<ListItem | null>(null)
    const [gameSearchPlatform, setGameSearchPlatform] = useState<'steam' | 'xbox'>('steam')
    const debouncedQuery = useDebounce(searchQuery, 300)

    // Only fetch data for the active tab (avoids unnecessary network + renders)
    const { data: gamesData, isLoading: gamesLoading } = api.gaming.getRecentlyPlayed.useQuery(
        undefined, { enabled: tab === 'GAMES' }
    )
    const { data: songsData, isLoading: songsLoading } = api.lastfm.getRecentTracks.useQuery(
        { limit: 20 }, { enabled: tab === 'SONGS' }
    )

    const isSearching = debouncedQuery.length > 1

    // Search queries — only fire when actively searching
    const { data: gameSearchResults, isFetching: gameSearchFetching } = api.gaming.searchGames.useQuery(
        { query: debouncedQuery },
        { enabled: tab === 'GAMES' && isSearching && gameSearchPlatform === 'steam' }
    )
    const { data: xboxSearchResults, isFetching: xboxSearchFetching } = api.gaming.searchXboxGames.useQuery(
        { query: debouncedQuery },
        { enabled: tab === 'GAMES' && isSearching && gameSearchPlatform === 'xbox' }
    )
    const { data: songSearchResults, isFetching: songSearchFetching } = api.lastfm.searchTracks.useQuery(
        { query: debouncedQuery },
        { enabled: tab === 'SONGS' && isSearching }
    )

    // Deduplicated songs list (memoized so it doesn't recompute on every render)
    const uniqueSongs = useMemo(() => {
        if (!songsData?.recentlyPlayed) return []
        const seen = new Set<string>()
        return songsData.recentlyPlayed.filter(song => {
            const entityId = `${song.artist.replace(/\s+/g, '-').toLowerCase()}-${song.name.replace(/\s+/g, '-').toLowerCase()}`
            if (seen.has(entityId)) return false
            seen.add(entityId)
            return true
        })
    }, [songsData?.recentlyPlayed])

    // Reset on tab change
    const handleTabChange = useCallback((newTab: 'GAMES' | 'SONGS') => {
        setTab(newTab)
        setSearchQuery('')
        setSelectedItem(null)
    }, [])

    const handleSelect = useCallback((item: ListItem) => {
        setSelectedItem(prev => prev?.entityId === item.entityId ? null : item)
    }, [])

    // Build the items list for current tab
    const gameItems = useMemo((): ListItem[] => {
        if (!gamesData?.steam) return []
        return gamesData.steam.map(g => ({
            entityId: g.appid.toString(),
            name: g.name,
            image: g.img_logo_url || g.img_icon_url,
            subtitle: g.playtime_2weeks ? `${Math.round(g.playtime_2weeks / 60 * 10) / 10}h this week` : undefined,
        }))
    }, [gamesData])

    const songItems = useMemo((): ListItem[] => {
        return uniqueSongs.map(s => ({
            entityId: `${s.artist.replace(/\s+/g, '-').toLowerCase()}-${s.name.replace(/\s+/g, '-').toLowerCase()}`,
            name: `${s.artist} - ${s.name}`,
            image: s.image,
        }))
    }, [uniqueSongs])

    // Search results as ListItems
    const searchItems = useMemo((): ListItem[] => {
        if (!isSearching) return []
        if (tab === 'GAMES') {
            const results = gameSearchPlatform === 'steam' ? gameSearchResults : xboxSearchResults
            return (results || []).map((g: any) => ({
                entityId: String(g.appid),
                name: g.name,
                image: g.img,
            }))
        }
        if (tab === 'SONGS') {
            return (songSearchResults || []).map((t: any) => ({
                entityId: `${t.artist.replace(/\s+/g, '-').toLowerCase()}-${t.name.replace(/\s+/g, '-').toLowerCase()}`,
                name: `${t.artist} - ${t.name}`,
                image: t.image,
            }))
        }
        return []
    }, [isSearching, tab, gameSearchPlatform, gameSearchResults, xboxSearchResults, songSearchResults])

    const currentType = tab === 'GAMES' ? 'GAME' as const : 'SONG' as const
    const isLoading = tab === 'GAMES' ? gamesLoading : songsLoading
    const isFetchingSearch = tab === 'GAMES' ? (gameSearchPlatform === 'steam' ? gameSearchFetching : xboxSearchFetching) : songSearchFetching
    const browseItems = tab === 'GAMES' ? gameItems : songItems

    return (
        <div className="w-full space-y-5">
            {/* ── Header bar: Tabs ──────────────────────────────────── */}
            <div className="flex p-1 bg-muted/40 border border-border rounded-xl max-w-[280px] mx-auto">
                {(['GAMES', 'SONGS'] as const).map((t) => (
                    <button
                        key={t}
                        onClick={() => handleTabChange(t)}
                        className={`relative flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${tab === t ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'}`}
                    >
                        {tab === t && (
                            <motion.div layoutId="adminTab" className="absolute inset-0 bg-card border border-border rounded-lg paper-shadow -z-10" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                        )}
                        <span className="flex items-center justify-center gap-1.5">
                            {t === 'GAMES' ? <FiCommand className="w-3.5 h-3.5" /> : <FiMusic className="w-3.5 h-3.5" />}
                            {t === 'GAMES' ? 'Games' : 'Songs'}
                        </span>
                    </button>
                ))}
            </div>

            {/* ── Sticky search area ───────────────────────────────── */}
            <div className="sticky top-20 z-30 bg-background/80 backdrop-blur-md -mx-4 px-4 py-3 border-b border-border/50">
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                    <input
                        type="text"
                        placeholder={tab === 'GAMES' ? `Search ${gameSearchPlatform === 'steam' ? 'Steam' : 'Xbox'} games...` : 'Search songs on Last.fm...'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-card border border-border rounded-lg pl-9 pr-20 py-2.5 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-muted-foreground/40"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="p-1 rounded text-muted-foreground/40 hover:text-foreground transition-colors"
                            >
                                <FiX className="w-3.5 h-3.5" />
                            </button>
                        )}
                        {tab === 'GAMES' && (
                            <button
                                onClick={() => setGameSearchPlatform(p => p === 'steam' ? 'xbox' : 'steam')}
                                className={`p-1.5 rounded-md transition-colors ${gameSearchPlatform === 'steam' ? 'text-muted-foreground hover:text-foreground' : 'text-green-500 hover:text-green-400'}`}
                                title={`Switch to ${gameSearchPlatform === 'steam' ? 'Xbox' : 'Steam'} search`}
                            >
                                {gameSearchPlatform === 'steam' ? <FaSteam className="w-3.5 h-3.5" /> : <FaXbox className="w-3.5 h-3.5" />}
                            </button>
                        )}
                    </div>
                    {isFetchingSearch && isSearching && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent/30 overflow-hidden rounded-b-lg">
                            <div className="h-full w-1/3 bg-accent animate-[shimmer_1s_ease-in-out_infinite] rounded-full" style={{ animation: 'shimmer 1s ease-in-out infinite' }} />
                        </div>
                    )}
                </div>
            </div>

            {/* ── Selected item → Review form (always renders in same position) ── */}
            <AnimatePresence>
                {selectedItem && (
                    <ReviewForm
                        key={selectedItem.entityId}
                        type={currentType}
                        entityId={selectedItem.entityId}
                        name={selectedItem.name}
                        image={selectedItem.image}
                        onClose={() => setSelectedItem(null)}
                    />
                )}
            </AnimatePresence>

            {/* ── Items list ────────────────────────────────────────── */}
            <div className="min-h-[200px]">
                {isSearching ? (
                    // Search results
                    <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider pl-1 mb-2">
                            {searchItems.length > 0 ? `${searchItems.length} results` : (isFetchingSearch ? 'Searching...' : 'No results')}
                        </p>
                        <div className="space-y-0.5">
                            {searchItems.map(item => (
                                <ItemRow
                                    key={item.entityId}
                                    item={item}
                                    isSelected={selectedItem?.entityId === item.entityId}
                                    onSelect={handleSelect}
                                    type={currentType}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    // Browse recent items
                    <div>
                        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider border-l-2 border-accent pl-3 mb-3">
                            {tab === 'GAMES' ? 'Recently Played' : 'Recently Listened'}
                        </h2>
                        {isLoading ? (
                            <div className="space-y-1">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-11 w-full bg-muted/30 animate-pulse rounded-lg" />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-0.5">
                                {browseItems.map(item => (
                                    <ItemRow
                                        key={item.entityId}
                                        item={item}
                                        isSelected={selectedItem?.entityId === item.entityId}
                                        onSelect={handleSelect}
                                        type={currentType}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

// ── Page ────────────────────────────────────────────────────────────────────────
export default function AdminPage() {
    return (
        <div className="min-h-screen flex items-center justify-center py-20 px-4 relative">
            <button
                onClick={() => logout()}
                className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-full bg-background/80 backdrop-blur-xl border border-border/50 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <FiLogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
            </button>
            <div className="w-full max-w-2xl flex flex-col items-center">
                <AdminDashboard />
            </div>
        </div>
    )
}
