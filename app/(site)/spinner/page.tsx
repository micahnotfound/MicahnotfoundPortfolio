'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MorphingHeaderLogo } from '@/components/shared/MorphingHeaderLogo'
import Image from 'next/image'

export default function SpinnerPage() {
  const router = useRouter()
  const [currentFrame, setCurrentFrame] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const lastXRef = useRef<number>(0)
  const animationFrameRef = useRef<number | null>(null)

  // Sprite sheet configuration
  const TOTAL_FRAMES = 64 // 8x8 grid
  const COLUMNS = 8
  const ROWS = 8
  const SPRITE_WIDTH = 1024 / COLUMNS // Assuming 1024px wide sprite sheet
  const SPRITE_HEIGHT = 1024 / ROWS // Assuming 1024px tall sprite sheet

  // Calculate sprite position based on frame
  const getFramePosition = (frameIndex: number) => {
    const col = frameIndex % COLUMNS
    const row = Math.floor(frameIndex / COLUMNS)
    return {
      x: col * SPRITE_WIDTH,
      y: row * SPRITE_HEIGHT
    }
  }

  // Handle mouse/touch drag
  const handleDragStart = (clientX: number) => {
    setIsDragging(true)
    lastXRef.current = clientX
  }

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return

    const deltaX = clientX - lastXRef.current
    const sensitivity = 2 // Pixels to move before changing frame

    if (Math.abs(deltaX) > sensitivity) {
      const frameChange = Math.floor(deltaX / sensitivity)
      setCurrentFrame(prev => {
        let newFrame = prev + frameChange
        // Wrap around
        if (newFrame < 0) newFrame = TOTAL_FRAMES + newFrame
        if (newFrame >= TOTAL_FRAMES) newFrame = newFrame - TOTAL_FRAMES
        return newFrame % TOTAL_FRAMES
      })
      lastXRef.current = clientX
    }
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleDragStart(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX)
  }

  const handleMouseUp = () => {
    handleDragEnd()
  }

  const handleMouseLeave = () => {
    handleDragEnd()
  }

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleDragStart(e.touches[0].clientX)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleDragMove(e.touches[0].clientX)
    }
  }

  const handleTouchEnd = () => {
    handleDragEnd()
  }

  // Auto-rotate on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const frameFromScroll = Math.floor((scrollY / 10) % TOTAL_FRAMES)
      if (!isDragging) {
        setCurrentFrame(frameFromScroll)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isDragging])

  const framePosition = getFramePosition(currentFrame)

  return (
    <div className="min-h-screen bg-[#D1D5DB]">
      {/* Header with M logo */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#D1D5DB] px-6 py-4">
        <div
          className="cursor-pointer inline-block"
          onClick={() => router.push('/')}
        >
          <MorphingHeaderLogo
            state={3}
            style={{
              width: '205px',
              height: 'auto'
            }}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-ui text-4xl font-bold mb-4">David Ruggles</h1>
          <p className="font-ui text-lg opacity-70">
            Drag left or right to rotate • Scroll to spin automatically
          </p>
        </div>

        {/* Spinner container */}
        <div
          ref={containerRef}
          className="relative w-full max-w-2xl mx-auto aspect-square cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            touchAction: 'none'
          }}
        >
          <div className="relative w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Sprite sheet display */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'url(https://res.cloudinary.com/dxmq5ewnv/image/upload/v1756571798/Profile_eapqj4.png)',
                backgroundSize: `${COLUMNS * 100}% ${ROWS * 100}%`,
                backgroundPosition: `-${framePosition.x}px -${framePosition.y}px`,
                backgroundRepeat: 'no-repeat',
                imageRendering: 'auto'
              }}
            />
          </div>

          {/* Frame counter (debug) */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full font-ui text-sm">
            Frame {currentFrame + 1} / {TOTAL_FRAMES}
          </div>
        </div>

        {/* Additional content for scrolling */}
        <div className="mt-16 space-y-8 font-ui">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">About David Ruggles</h2>
            <p className="leading-relaxed">
              David Ruggles (1810–1849) was an African American abolitionist, printer, and journalist who dedicated his life to the anti-slavery movement. He was a key conductor on the Underground Railroad, helping hundreds of enslaved people escape to freedom, including Frederick Douglass.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Legacy</h2>
            <p className="leading-relaxed">
              Ruggles was also a pioneering journalist and publisher, founding the first African American magazine and bookstore in New York City. His activism and courage in the face of danger made him one of the most important figures in the abolitionist movement.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Keep scrolling...</h2>
            <p className="leading-relaxed">
              Watch the character rotate as you scroll through the page. This interactive 3D effect is created using a sprite sheet with 64 frames captured from different angles around the subject.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Interactive Experience</h2>
            <p className="leading-relaxed">
              You can also click and drag left or right on the character to manually control the rotation. This technique is commonly used in product photography to create engaging 360° views.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
