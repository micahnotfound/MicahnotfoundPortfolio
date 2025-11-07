'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

// State system:
// - null (home state): Logo, About, Contact visible - default when nothing is hovered
// - 'card': Hovering over photo cards in carousel
// - 'textbox': Hovering over text boxes below cards
// - 'header': Hovering over header area
type HoverArea = 'header' | 'card' | 'textbox' | null

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
