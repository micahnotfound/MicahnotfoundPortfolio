'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [currentState, setCurrentState] = useState<1 | 2 | 3>(3)

  // STATE ONE: Original full MMM logo with inner stroke
  const stateOnePath = "M56.62,56.07c.13-3.22,2.75-5.74,5.98-5.74s5.84,2.52,5.97,5.73l6.56,98.8h109.45l6.56-98.8c.14-3.21,2.76-5.73,5.97-5.73s5.84,2.52,5.97,5.74l6.25,98.79h109.46l6.57-98.8c.14-3.21,2.76-5.73,5.97-5.73s5.84,2.52,5.97,5.74l6.25,98.79h50.38l-6.33-100.82c-1.22-30.31-25.94-54.05-56.27-54.05s-54.98,23.69-56.26,53.93l-5.34,69.95h-11.26l-5.08-69.83c-1.22-30.31-25.94-54.05-56.27-54.05s-54.98,23.69-56.26,53.93l-5.34,69.95h-11.31l-5.34-69.95C117.58,23.69,92.87,0,62.6,0S7.55,23.74,6.33,54.05L0,154.87h50.38l6.25-98.79Z"

  // STATE TWO: Taller version - bottom third points moved down, top curves preserved
  const stateTwoPath = "M56.62,56.07c.13-3.22,2.75-5.74,5.98-5.74s5.84,2.52,5.97,5.73l6.56,148.8h109.45l6.56-148.8c.14-3.21,2.76-5.73,5.97-5.73s5.84,2.52,5.97,5.74l6.25,148.79h109.46l6.57-148.8c.14-3.21,2.76-5.73,5.97-5.73s5.84,2.52,5.97,5.74l6.25,148.79h50.38l-6.33-150.82c-1.22-30.31-25.94-54.05-56.27-54.05s-54.98,23.69-56.26,53.93l-5.34,119.95h-11.26l-5.08-119.83c-1.22-30.31-25.94-54.05-56.27-54.05s-54.98,23.69-56.26,53.93l-5.34,119.95h-11.31l-5.34-119.95C117.58,23.69,92.87,0,62.6,0S7.55,23.74,6.33,54.05L0,204.87h50.38l6.25-148.79Z"

  // STATE THREE: Short version - bottom third points moved up slightly, top curves preserved
  const stateThreePath = "M56.62,56.07c.13-3.22,2.75-5.74,5.98-5.74s5.84,2.52,5.97,5.73l6.56,73.8h109.45l6.56-73.8c.14-3.21,2.76-5.73,5.97-5.73s5.84,2.52,5.97,5.74l6.25,73.79h109.46l6.57-73.8c.14-3.21,2.76-5.73,5.97-5.73s5.84,2.52,5.97,5.74l6.25,73.79h50.38l-6.33-75.82c-1.22-30.31-25.94-54.05-56.27-54.05s-54.98,23.69-56.26,53.93l-5.34,44.95h-11.26l-5.08-44.83c-1.22-30.31-25.94-54.05-56.27-54.05s-54.98,23.69-56.26,53.93l-5.34,44.95h-11.31l-5.34-44.95C117.58,23.69,92.87,0,62.6,0S7.55,23.74,6.33,54.05L0,129.87h50.38l6.25-73.79Z"

  const getCurrentPath = () => {
    switch (currentState) {
      case 1:
        return stateOnePath
      case 2:
        return stateTwoPath
      case 3:
        return stateThreePath
      default:
        return stateOnePath
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      <div className="w-full max-w-4xl px-8">
        <div className="flex items-center justify-center">
          <svg
            id="Layer_1"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 393.95 129.87"
            className="w-full h-auto"
          >
            <defs>
              <clipPath id="innerClip">
                <path d={getCurrentPath()} />
              </clipPath>
            </defs>

            {/* STATE ONE: Thick stroke clipped to show only inner edge with sharp corners */}
            <g clipPath="url(#innerClip)">
              <path
                d={getCurrentPath()}
                fill="none"
                stroke="#2A033F"
                strokeWidth="20"
                strokeLinecap="butt"
                strokeLinejoin="miter"
                style={{
                  transition: 'd 500ms ease-out'
                }}
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
  )
}
