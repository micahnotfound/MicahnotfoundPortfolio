'use client'

import { useEffect, useState, useRef } from 'react'

interface CursorPosition {
  x: number
  y: number
}

export function MagneticCursor() {
  const [cursorPos, setCursorPos] = useState<CursorPosition>({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const cursorRingRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>()
  const currentPosRef = useRef<CursorPosition>({ x: 0, y: 0 })
  const targetPosRef = useRef<CursorPosition>({ x: 0, y: 0 })

  // Detect if mobile device
  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      setIsMobile(isTouchDevice)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Smooth animation loop using RAF
    const animateCursor = () => {
      const dx = targetPosRef.current.x - currentPosRef.current.x
      const dy = targetPosRef.current.y - currentPosRef.current.y

      // Smooth lerp for buttery movement
      currentPosRef.current.x += dx * 0.2
      currentPosRef.current.y += dy * 0.2

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${currentPosRef.current.x}px, ${currentPosRef.current.y}px)`
      }

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate(${currentPosRef.current.x}px, ${currentPosRef.current.y}px)`
      }

      rafRef.current = requestAnimationFrame(animateCursor)
    }

    rafRef.current = requestAnimationFrame(animateCursor)

    const handleMouseMove = (e: MouseEvent) => {
      targetPosRef.current = { x: e.clientX, y: e.clientY }

      // Check if hovering over a hoverable element
      const target = e.target as HTMLElement
      const hoverableElement = target.closest('[data-cursor-hover]')

      setIsHovering(!!hoverableElement)
    }

    const handleMouseLeave = () => {
      setIsHovering(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  // Don't render cursor on mobile devices
  if (isMobile) {
    return null
  }

  return (
    <>
      {/* Cursor dot - small circular dot */}
      <div
        ref={cursorDotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
        style={{
          width: '8px',
          height: '8px',
          marginLeft: '-4px',
          marginTop: '-4px',
        }}
      >
        <div className="w-full h-full bg-white rounded-full" />
      </div>
    </>
  )
}
