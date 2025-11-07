'use client'

import { CSSProperties } from 'react'

interface MorphingHeaderLogoProps {
  state: 1 | 2 | 3
  className?: string
  style?: CSSProperties
}

export function MorphingHeaderLogo({ state, className = '', style }: MorphingHeaderLogoProps) {
  // STATE ONE: Extra tall version - 2x tall for initial state (~410px)
  const stateOnePath = "M56.62,56.07c.13-3.22,2.75-5.74,5.98-5.74s5.84,2.52,5.97,5.73l6.56,298.6h109.45l6.56-298.6c.14-3.21,2.76-5.73,5.97-5.73s5.84,2.52,5.97,5.74l6.25,298.59h109.46l6.57-298.6c.14-3.21,2.76-5.73,5.97-5.73s5.84,2.52,5.97,5.74l6.25,298.59h50.38l-6.33-300.62c-1.22-30.31-25.94-54.05-56.27-54.05s-54.98,23.69-56.26,53.93l-5.34,269.75h-11.26l-5.08-269.63c-1.22-30.31-25.94-54.05-56.27-54.05s-54.98,23.69-56.26,53.93l-5.34,269.75h-11.31l-5.34-269.75C117.58,23.69,92.87,0,62.6,0S7.55,23.74,6.33,54.05L0,354.67h50.38l6.25-298.59Z"

  // STATE TWO: Tall version - bottom third points moved down, top curves preserved
  const stateTwoPath = "M56.62,56.07c.13-3.22,2.75-5.74,5.98-5.74s5.84,2.52,5.97,5.73l6.56,148.8h109.45l6.56-148.8c.14-3.21,2.76-5.73,5.97-5.73s5.84,2.52,5.97,5.74l6.25,148.79h109.46l6.57-148.8c.14-3.21,2.76-5.73,5.97-5.73s5.84,2.52,5.97,5.74l6.25,148.79h50.38l-6.33-150.82c-1.22-30.31-25.94-54.05-56.27-54.05s-54.98,23.69-56.26,53.93l-5.34,119.95h-11.26l-5.08-119.83c-1.22-30.31-25.94-54.05-56.27-54.05s-54.98,23.69-56.26,53.93l-5.34,119.95h-11.31l-5.34-119.95C117.58,23.69,92.87,0,62.6,0S7.55,23.74,6.33,54.05L0,204.87h50.38l6.25-148.79Z"

  // STATE THREE: Short version - bottom third points moved up, top curves preserved
  const stateThreePath = "M56.62,56.07c.13-3.22,2.75-5.74,5.98-5.74s5.84,2.52,5.97,5.73l6.56,73.8h109.45l6.56-73.8c.14-3.21,2.76-5.73,5.97-5.73s5.84,2.52,5.97,5.74l6.25,73.79h109.46l6.57-73.8c.14-3.21,2.76-5.73,5.97-5.73s5.84,2.52,5.97,5.74l6.25,73.79h50.38l-6.33-75.82c-1.22-30.31-25.94-54.05-56.27-54.05s-54.98,23.69-56.26,53.93l-5.34,44.95h-11.26l-5.08-44.83c-1.22-30.31-25.94-54.05-56.27-54.05s-54.98,23.69-56.26,53.93l-5.34,44.95h-11.31l-5.34-44.95C117.58,23.69,92.87,0,62.6,0S7.55,23.74,6.33,54.05L0,129.87h50.38l6.25-73.79Z"

  const getCurrentPath = () => {
    if (state === 1) return stateOnePath // Extra tall
    if (state === 2) return stateTwoPath // Tall
    return stateThreePath // Short
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 393.95 354.67"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={style}
    >
      {/* Solid black filled path */}
      <path
        d={getCurrentPath()}
        fill="#000000"
        style={{
          transition: 'd 500ms ease-out'
        }}
      />
    </svg>
  )
}
