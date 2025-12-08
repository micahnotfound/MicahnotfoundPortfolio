'use client'

import { useEffect, useState, useRef } from 'react'

interface CursorPosition {
  x: number
  y: number
}

export function MagneticCursor() {
  const [cursorPos, setCursorPos] = useState<CursorPosition>({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isMobile, setIsMobile] = useState<boolean | null>(null) // null = checking, true = mobile, false = desktop
  const [isVisible, setIsVisible] = useState(false)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const cursorRingRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>()
  const currentPosRef = useRef<CursorPosition>({ x: 0, y: 0 })
  const targetPosRef = useRef<CursorPosition>({ x: 0, y: 0 })

  // Detect if mobile device (small viewport only - don't check touch since desktops can have touchscreens)
  useEffect(() => {
    const checkMobile = () => {
      const isSmallViewport = window.innerWidth < 768
      setIsMobile(isSmallViewport)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile) return // Don't run on mobile

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

      // Make cursor visible on first mouse move
      setIsVisible(true)

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
  }, [isMobile])

  // Don't render cursor while checking or on mobile devices
  if (isMobile === null || isMobile === true) {
    return null
  }

  return (
    <>
      {/* Cursor dot - larger circular dot with color inversion */}
      <div
        ref={cursorDotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
        style={{
          width: '12px',
          height: '12px',
          marginLeft: '-6px',
          marginTop: '-6px',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
      >
        <div className="w-full h-full bg-white rounded-full" />
      </div>
    </>
  )
}
