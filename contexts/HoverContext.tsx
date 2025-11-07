'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type HoverArea = 'photo' | 'button' | null

interface HoverContextType {
  hoverArea: HoverArea
  setHoverArea: (area: HoverArea) => void
}

const HoverContext = createContext<HoverContextType | undefined>(undefined)

export function HoverProvider({ children }: { children: ReactNode }) {
  const [hoverArea, setHoverArea] = useState<HoverArea>(null)

  return (
    <HoverContext.Provider value={{ hoverArea, setHoverArea }}>
      {children}
    </HoverContext.Provider>
  )
}

export function useHover() {
  const context = useContext(HoverContext)
  if (context === undefined) {
    throw new Error('useHover must be used within a HoverProvider')
  }
  return context
}
