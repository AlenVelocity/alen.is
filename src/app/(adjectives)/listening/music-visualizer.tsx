"use client"

import { useEffect, useState } from "react"

export function MusicVisualizer() {
  const [heights, setHeights] = useState<number[]>([])
  const [durations, setDurations] = useState<number[]>([])
  
  // Generate random heights and durations for the bars
  useEffect(() => {
    const newHeights = Array.from({ length: 5 }, () => Math.max(30, Math.random() * 100))
    const newDurations = Array.from({ length: 5 }, () => 0.8 + Math.random() * 0.7)
    
    setHeights(newHeights)
    setDurations(newDurations)
    
    // Regenerate heights periodically for animation effect
    const interval = setInterval(() => {
      setHeights(prev => 
        prev.map(h => Math.max(30, Math.random() * 100))
      )
    }, 1800)
    
    return () => clearInterval(interval)
  }, [])
  
  if (heights.length === 0) return null;
  
  return (
    <div className="flex items-end h-6 gap-[2px] ml-2">
      {heights.map((height, i) => (
        <div 
          key={i}
          className="w-1 bg-green-500 rounded-t-sm animate-pulse"
          style={{ 
            height: `${height}%`,
            animationDuration: `${durations[i]}s`
          }}
        />
      ))}
    </div>
  )
} 