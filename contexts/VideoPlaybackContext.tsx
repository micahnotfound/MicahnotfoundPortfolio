'use client'

import { createContext, useContext, useRef, useState, useEffect, ReactNode } from 'react'

interface VideoPlaybackState {
  currentTime: number
  lastUpdated: number
}

interface VideoPlaybackContextType {
  getPlaybackTime: (id: string) => number
  setPlaybackTime: (id: string, time: number) => void
}

const VideoPlaybackContext = createContext<VideoPlaybackContextType | undefined>(undefined)

export function VideoPlaybackProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Record<string, VideoPlaybackState>>({})
  const lastFlushRef = useRef<number>(Date.now())

  const getPlaybackTime = (id: string) => {
    const entry = state[id]
    return entry ? entry.currentTime : 0
  }

  const setPlaybackTime = (id: string, time: number) => {
    setState(prev => ({
      ...prev,
      [id]: {
        currentTime: time,
        lastUpdated: Date.now()
      }
    }))
  }

  // Simple cleanup to avoid unbounded growth – drop very old entries occasionally
  useEffect(() => {
    const now = Date.now()
    if (now - lastFlushRef.current < 30_000) return
    lastFlushRef.current = now

    setState(prev => {
      const cutoff = now - 5 * 60_000 // keep last 5 minutes of activity
      const next: Record<string, VideoPlaybackState> = {}
      for (const [id, value] of Object.entries(prev)) {
        if (value.lastUpdated >= cutoff) {
          next[id] = value
        }
      }
      return next
    })
  }, [state])

  return (
    <VideoPlaybackContext.Provider value={{ getPlaybackTime, setPlaybackTime }}>
      {children}
    </VideoPlaybackContext.Provider>
  )
}

export function useVideoPlayback() {
  const ctx = useContext(VideoPlaybackContext)
  if (!ctx) {
    throw new Error('useVideoPlayback must be used within a VideoPlaybackProvider')
  }
  return ctx
}

