'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { MorphingHeaderLogo } from '@/components/shared/MorphingHeaderLogo'
import { CarouselMedia } from '@/components/shared/CarouselMedia'
import { getProjects } from '@/lib/content'
import type { Project } from '@/types/content'

export default function TestMobilePage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Mobile states
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [dragProgress, setDragProgress] = useState(0)
  const [headerTopPosition, setHeaderTopPosition] = useState(71)
  const [isAnimating, setIsAnimating] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(0)
  const [logoState, setLogoState] = useState<0 | 1 | 2 | 3>(0)
  const [showSwipeIndicator, setShowSwipeIndicator] = useState(false)
  const mobileCarouselTouchStart = useRef<{ y: number; time: number; startIndex: number } | null>(null)
  const isDragging = useRef(false)
  const dragDirection = useRef<'up' | 'down' | null>(null)
  const lastTouchY = useRef<number>(0)
  const lastTouchTime = useRef<number>(0)
  const swipeIndicatorTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [isContactExpandedMobile, setIsContactExpandedMobile] = useState(false)
  const [isAboutExpandedMobile, setIsAboutExpandedMobile] = useState(false)

  useEffect(() => {
    const loadProjects = async () => {
      const projectsData = getProjects()
      setProjects(projectsData)
      setIsLoading(false)
    }
    loadProjects()
  }, [])

  // Auto-close contact buttons when logo state changes
  useEffect(() => {
    if (logoState === 3) {
      setIsContactExpandedMobile(false)
    }
  }, [logoState])

  // Handle About button expansion - triggers logo animation
  const handleAboutClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isAboutExpandedMobile) {
      // Expanding - shrink M to state 3 and move it 50px higher (52 - 50 = 2)
      setIsAboutExpandedMobile(true)
      setLogoState(3)
      setHeaderTopPosition(2)
    } else {
      // Collapsing - return M to state 0 and home state
      setIsAboutExpandedMobile(false)
      setLogoState(0)
      setHeaderTopPosition(71)
    }
  }

  // Handle Contact button expansion - triggers M to state 2 (medium size)
  const handleContactClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isContactExpandedMobile) {
      // Expanding - M to state 2 (medium) and move it up
      setIsContactExpandedMobile(true)
      setLogoState(2)
      setHeaderTopPosition(32)
    } else {
      // Collapsing - return M to state 0 and home state
      setIsContactExpandedMobile(false)
      setLogoState(0)
      setHeaderTopPosition(71)
    }
  }

  // Handle page click to close About or Contact
  const handlePageClick = () => {
    if (isAboutExpandedMobile) {
      setIsAboutExpandedMobile(false)
      setLogoState(0)
      setHeaderTopPosition(71)
    }
    if (isContactExpandedMobile) {
      setIsContactExpandedMobile(false)
      setLogoState(0)
      setHeaderTopPosition(71)
    }
  }

  // Track viewport height for mobile
  useEffect(() => {
    const updateViewportHeight = () => {
      setViewportHeight(window.innerHeight)
    }
    updateViewportHeight()
    window.addEventListener('resize', updateViewportHeight)
    return () => window.removeEventListener('resize', updateViewportHeight)
  }, [])

  // Mobile: Show swipe indicator after 5 seconds with video bob animation
  // Only show when About button is closed and after 5 seconds of inactivity
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (isLoading || projects.length === 0) return
    if (isAboutExpandedMobile) {
      // If About is open, clear any existing timer and hide indicator
      if (swipeIndicatorTimerRef.current) {
        clearTimeout(swipeIndicatorTimerRef.current)
      }
      setShowSwipeIndicator(false)
      return
    }

    // About is closed - start timer to show indicator after 5 seconds
    swipeIndicatorTimerRef.current = setTimeout(() => {
      setShowSwipeIndicator(true)
      setTimeout(() => {
        setShowSwipeIndicator(false)
      }, 5000)
    }, 5000)

    return () => {
      if (swipeIndicatorTimerRef.current) {
        clearTimeout(swipeIndicatorTimerRef.current)
      }
    }
  }, [isLoading, projects.length, isAboutExpandedMobile])

  // Touch event handlers for mobile carousel
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (selectedIndex === -1 && e.touches.length === 1) {
        const touch = e.touches[0]
        mobileCarouselTouchStart.current = {
          y: touch.clientY,
          time: Date.now(),
          startIndex: selectedIndex
        }
        isDragging.current = false
        dragDirection.current = null
        lastTouchY.current = touch.clientY
        lastTouchTime.current = Date.now()
      } else if (selectedIndex >= 0 && e.touches.length === 1) {
        const touch = e.touches[0]
        mobileCarouselTouchStart.current = {
          y: touch.clientY,
          time: Date.now(),
          startIndex: selectedIndex
        }
        isDragging.current = false
        dragDirection.current = null
        lastTouchY.current = touch.clientY
        lastTouchTime.current = Date.now()
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!mobileCarouselTouchStart.current || !isDragging.current) return

      const touch = e.touches[0]
      const currentY = touch.clientY
      const dragDistance = mobileCarouselTouchStart.current.y - currentY
      const threshold = 10

      if (Math.abs(dragDistance) > threshold) {
        isDragging.current = true

        if (!dragDirection.current) {
          dragDirection.current = dragDistance > 0 ? 'up' : 'down'
        }

        const progress = Math.min(Math.abs(dragDistance) / (viewportHeight * 0.5), 1)
        setDragProgress(progress)

        if (selectedIndex === -1 && dragDirection.current === 'up') {
          const newLogoState = Math.min(3, Math.floor(progress * 4)) as 0 | 1 | 2 | 3
          setLogoState(newLogoState)

          const topPositions = [71, 71, 61, 52]
          setHeaderTopPosition(topPositions[newLogoState])
        }
      }

      lastTouchY.current = currentY
      lastTouchTime.current = Date.now()
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!mobileCarouselTouchStart.current) return

      const touchEnd = e.changedTouches[0].clientY

      const distance = mobileCarouselTouchStart.current.y - touchEnd
      const timeDiff = Date.now() - mobileCarouselTouchStart.current.time
      const velocity = Math.abs(distance) / timeDiff

      const swipeThreshold = 50
      const velocityThreshold = 0.3

      const isSwipeUp = distance > swipeThreshold || (distance > 20 && velocity > velocityThreshold)
      const isSwipeDown = distance < -swipeThreshold || (distance < -20 && velocity > velocityThreshold)

      if (selectedIndex === -1) {
        if (isSwipeUp && projects.length > 0) {
          setIsAnimating(true)
          requestAnimationFrame(() => {
            setSelectedIndex(0)
            setLogoState(3)
            setHeaderTopPosition(52)
            setTimeout(() => setIsAnimating(false), 500)
          })
        } else {
          setLogoState(0)
          setHeaderTopPosition(71)
        }
      } else {
        if (isSwipeUp && selectedIndex < projects.length - 1) {
          setIsAnimating(true)
          const nextIndex = selectedIndex + 1
          requestAnimationFrame(() => {
            setSelectedIndex(nextIndex)
            setTimeout(() => setIsAnimating(false), 500)
          })
        } else if (isSwipeDown) {
          if (selectedIndex === 0) {
            setIsAnimating(true)
            requestAnimationFrame(() => {
              setSelectedIndex(-1)
              setLogoState(0)
              setHeaderTopPosition(71)
              setTimeout(() => setIsAnimating(false), 500)
            })
          } else {
            setIsAnimating(true)
            const prevIndex = selectedIndex - 1
            requestAnimationFrame(() => {
              setSelectedIndex(prevIndex)
              setTimeout(() => setIsAnimating(false), 500)
            })
          }
        }
      }

      setDragProgress(0)
      isDragging.current = false
      dragDirection.current = null
      mobileCarouselTouchStart.current = null
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [selectedIndex, projects.length, viewportHeight])

  // Mobile helper functions
  const handleThumbnailClick = (index: number, project: Project) => {
    if (selectedIndex === index) {
      window.location.href = `/work/${project.slug}`
    } else {
      setIsAnimating(true)
      requestAnimationFrame(() => {
        setSelectedIndex(index)
        setLogoState(3)
        setHeaderTopPosition(52)
        setTimeout(() => setIsAnimating(false), 500)
      })
    }
  }

  const getButtonsMarginTop = () => {
    if (logoState === 0) return '15px'
    if (logoState === 1) return '15px'
    if (logoState === 3) return '-150px'
    return '-75px'
  }

  const getButtonHeight = () => {
    if (logoState === 0) return '32px'
    if (logoState === 1) return '32px'
    if (logoState === 2) return '18px'
    if (logoState === 3) return '0px'
    return '18px'
  }

  const getButtonGap = () => {
    if (logoState === 0) return '16px'
    if (logoState === 1) return '16px'
    if (logoState === 3) return '0px'
    return '8px'
  }

  const getButtonOpacity = () => {
    if (logoState === 0) return 1
    if (logoState === 1) return 1
    if (logoState === 3) return 0
    return 0.5
  }

  const getHeaderHeight = () => {
    const logoState0Height = 534
    const logoState1Height = 454
    const logoState2Height = 292
    const logoState3Height = 130

    let currentLogoHeight = logoState1Height
    if (logoState === 0) currentLogoHeight = logoState0Height
    if (logoState === 1) currentLogoHeight = logoState1Height
    if (logoState === 2) currentLogoHeight = logoState2Height
    if (logoState === 3) currentLogoHeight = logoState3Height

    if (logoState === 0) {
      return currentLogoHeight - 100
    } else if (logoState === 1) {
      return currentLogoHeight - 100
    } else if (logoState === 2) {
      return currentLogoHeight - 40
    } else {
      return currentLogoHeight - 20
    }
  }

  const getImageHeight = () => {
    if (viewportHeight === 0) return '0px'

    const textBubbleHeight = 36
    const gapBetweenImageAndBubble = 7
    const topMargin = 12
    const maxHeightPx = viewportHeight - textBubbleHeight - gapBetweenImageAndBubble - topMargin

    return `${maxHeightPx}px`
  }

  const getTextBubblesBottom = () => {
    if (viewportHeight === 0) return '54.4px'

    if (logoState === 0) {
      return '54.4px'
    } else if (logoState === 3) {
      const bubbleHeight = 36
      const bubbleGap = 16
      const totalBubblesHeight = projects.length * (bubbleHeight + bubbleGap)
      const middleOfScreen = viewportHeight / 2
      return `${middleOfScreen - totalBubblesHeight / 2}px`
    } else {
      const bottomPos = 54.4
      const middlePos = (viewportHeight / 2) - ((projects.length * 52) / 2)
      const progress = logoState / 3
      return `${bottomPos + (middlePos - bottomPos) * progress}px`
    }
  }

  return (
    <>
      <style jsx>{`
        @keyframes bubbleWave {
          0%, 100% {
            width: 12px;
          }
          50% {
            width: calc(100vw - 80px);
          }
        }
        @keyframes iconBobAndFade {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(0);
          }
          20% {
            opacity: 1;
          }
          40%, 60% {
            transform: translateX(-50%) translateY(-10px);
          }
          50%, 70% {
            transform: translateX(-50%) translateY(0);
          }
          80% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(0);
          }
        }
        @keyframes cardPeek {
          0% {
            transform: translateY(100%);
          }
          20% {
            transform: translateY(0);
          }
          80% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(100%);
          }
        }
      `}</style>

      <div className="h-screen w-full relative overflow-hidden bg-[#D1D5DB]" onClick={handlePageClick}>
        {/* Mobile Header */}
        <div
          className="absolute left-0 w-full pointer-events-none"
          style={{
            top: `${headerTopPosition}px`,
            height: `${getHeaderHeight()}px`,
            paddingTop: '12px',
            paddingBottom: '8px',
            paddingLeft: '30px',
            paddingRight: '32px',
            transition: isDragging.current ? 'none' : 'top 500ms ease-out',
            zIndex: isAboutExpandedMobile || isContactExpandedMobile ? 50 : 20
          }}
        >
          <div className="flex flex-col items-start pointer-events-auto">
            <div className="flex-shrink-0">
              <MorphingHeaderLogo
                state={logoState}
                style={{
                  width: '174px',
                  height: 'auto'
                }}
              />
            </div>

            {/* Buttons container - positioned underneath M SVG */}
            <div
              className="relative transition-all duration-500 ease-out"
              style={{
                marginTop: getButtonsMarginTop(),
                width: '100%'
              }}
            >
              {/* About button - absolutely positioned so it doesn't push Contact */}
              <div
                className="font-ui bg-core-dark text-white cursor-pointer flex-shrink-0"
                style={{
                  position: isAboutExpandedMobile ? 'absolute' : 'relative',
                  top: isAboutExpandedMobile ? '-11px' : (isContactExpandedMobile ? '-9px' : 0),
                  left: 0,
                  border: 'none',
                  padding: isAboutExpandedMobile ? '1rem' : '0 1rem',
                  paddingBottom: isAboutExpandedMobile ? '2rem' : '0',
                  borderRadius: '0px',
                  height: isAboutExpandedMobile ? `calc(100vh - ${headerTopPosition}px - ${getHeaderHeight()}px - 12px + 4px - 3px)` : '32px',
                  width: isAboutExpandedMobile ? `calc(100vw - 30px - 32px)` : '76.5px',
                  minWidth: isAboutExpandedMobile ? 'auto' : '76.5px',
                  opacity: 1,
                  maskImage: 'none',
                  WebkitMaskImage: 'none',
                  overflow: 'hidden',
                  transition: 'width 600ms ease-out, height 600ms ease-out, padding 600ms ease-out, padding-bottom 600ms ease-out, position 0s, top 600ms ease-out',
                  zIndex: isAboutExpandedMobile ? 40 : 1,
                  display: 'inline-block',
                  fontSize: '14px'
                }}
                onClick={handleAboutClick}
              >
                {/* Button content container */}
                <div className="relative w-full h-full">
                  {/* About label - hides when expanded */}
                  {!isAboutExpandedMobile && (
                    <div
                      className="absolute top-0 left-0 w-full"
                      style={{
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px'
                      }}
                    >
                      about
                    </div>
                  )}

                  {/* Photo - positioned at top of expanded container */}
                  {isAboutExpandedMobile && (
                    <div
                      className="absolute left-0"
                      style={{
                        top: '6px',
                        opacity: isAboutExpandedMobile ? 1 : 0,
                        transition: 'opacity 600ms ease-out',
                        pointerEvents: isAboutExpandedMobile ? 'auto' : 'none'
                      }}
                    >
                      <div style={{ width: '120px', height: '110px', overflow: 'hidden' }}>
                        <img
                          src="https://res.cloudinary.com/dxmq5ewnv/image/upload/v1756680394/micah_j75jbv.png"
                          alt="Micah Milner"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', marginTop: '-15px' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Expanded content - fades in below */}
                  {isAboutExpandedMobile && (
                    <div
                      className="absolute left-0 w-full text-left"
                      style={{
                        top: '120px',
                        opacity: isAboutExpandedMobile ? 1 : 0,
                        transition: 'opacity 600ms ease-out',
                        pointerEvents: isAboutExpandedMobile ? 'auto' : 'none'
                      }}
                    >
                      <div className="text-[0.8em] leading-relaxed text-white">
                        <p className="mb-4">
                          Hi, I&apos;m Micah. An award winning artist and entrepreneur with a focus on art, technology, and public storytelling. I co-founded Kinfolk Tech, a digital platform where we create and host projects that transform underrepresented histories into immersive exhibitions for museums, classrooms, and public spaces. To date we&apos;ve raised over 8 million dollars, exhibited at the MoMA and Tribeca Film Festival and worked with world renowned artists like Hank Willis Thomas and Wangechi Mutu.
                        </p>
                        <p>
                          Before that I was a part of the NY based art collective ART404. We explored virality as a medium, creating projects that became Twitters top trending topic multiple times. The work moved across digital and physical mediums commenting on the rise of internet culture and the growing influence of tech companies in America.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact button - expands upwards */}
              <div
                className="font-ui bg-core-dark text-white cursor-pointer flex-shrink-0"
                style={{
                  position: 'absolute',
                  top: isContactExpandedMobile ? `-9px` : 0,
                  left: '92.5px', // 76.5px (About width) + 16px gap
                  border: 'none',
                  padding: isContactExpandedMobile ? '1rem' : '0 1rem',
                  paddingBottom: isContactExpandedMobile ? '2rem' : '0',
                  borderRadius: '0px',
                  height: isContactExpandedMobile ? `calc(100vh - ${headerTopPosition}px - ${getHeaderHeight()}px - 12px + 4px - 3px - 251px)` : '32px',
                  width: isContactExpandedMobile ? `calc(100vw - 30px - 32px - 92.5px - 16px)` : 'auto',
                  minWidth: '76.5px',
                  opacity: 1,
                  maskImage: 'none',
                  WebkitMaskImage: 'none',
                  overflow: 'hidden',
                  transition: 'width 600ms ease-out, height 600ms ease-out, padding 600ms ease-out, padding-bottom 600ms ease-out, position 0s, top 600ms ease-out',
                  zIndex: isContactExpandedMobile ? 40 : 1,
                  display: 'inline-block',
                  fontSize: '14px'
                }}
                onClick={handleContactClick}
              >
                {/* Button content container */}
                <div className="relative w-full h-full">
                  {/* Contact label - hides when expanded */}
                  {!isContactExpandedMobile && (
                    <div
                      className="absolute top-0 left-0 w-full"
                      style={{
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px'
                      }}
                    >
                      contact
                    </div>
                  )}

                  {/* Expanded content - fades in below */}
                  {isContactExpandedMobile && (
                    <div
                      className="absolute left-0 w-full text-left"
                      style={{
                        top: '6px',
                        opacity: isContactExpandedMobile ? 1 : 0,
                        transition: 'opacity 600ms ease-out',
                        pointerEvents: isContactExpandedMobile ? 'auto' : 'none'
                      }}
                    >
                      <div className="space-y-1 text-[0.8em]">
                        <a href="mailto:Micah@art404.com" className="block hover:underline">
                          Micah@art404.com
                        </a>
                        <a
                          href="https://www.linkedin.com/in/micah-milner-5bb13729/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block hover:underline"
                        >
                          LinkedIn
                        </a>
                        <a
                          href="https://www.instagram.com/micahnotfound/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block hover:underline"
                        >
                          Instagram
                        </a>
                        <div>8636024715</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Carousel */}
        <div className="h-full w-full relative overflow-hidden">
          <div
            className="absolute left-0 w-full"
            style={{
              top: '12px',
              paddingLeft: '12px',
              paddingRight: '12px'
            }}
          >
            {projects.map((project, index) => {
              const hasReel = !!project.reel
              const displayMedia = hasReel ? project.reel : (project.thumbnails && project.thumbnails.length > 0
                ? project.thumbnails[0]
                : project.cover)

              const imageHeight = getImageHeight()

              let translateYPx = 0

              if (selectedIndex === -1) {
                if (index === 0) {
                  translateYPx = viewportHeight
                  if (isDragging.current && dragDirection.current === 'up' && dragProgress > 0) {
                    translateYPx = viewportHeight * (1 - dragProgress)
                  }
                } else {
                  return null
                }
              } else {
                const cardSpacing = viewportHeight > 0 ? viewportHeight + 50 : 1000
                translateYPx = (index - selectedIndex) * cardSpacing

                if (isDragging.current && dragProgress > 0 && dragDirection.current) {
                  if (dragDirection.current === 'up') {
                    translateYPx -= dragProgress * cardSpacing
                  } else if (dragDirection.current === 'down') {
                    translateYPx += dragProgress * cardSpacing
                  }
                }

                const isNearVisible = Math.abs(index - selectedIndex) <= 1
                if (!isNearVisible) return null
              }

              return (
                <div
                  key={`${project.slug}-${index}`}
                  className="absolute top-0 left-0 w-full cursor-pointer"
                  style={{
                    transform: `translateY(${translateYPx}px)`,
                    transition: isDragging.current ? 'none' : 'transform 0.5s ease-out',
                    paddingLeft: '12px',
                    paddingRight: '12px'
                  }}
                  onClick={() => handleThumbnailClick(index, project)}
                >
                  <div
                    className="relative overflow-hidden"
                    style={{
                      height: imageHeight,
                      borderRadius: '24px',
                      width: '100%',
                      transition: isDragging.current ? 'none' : 'height 0.5s ease-out'
                    }}
                  >
                    {imageHeight !== '0px' && displayMedia && (
                      <CarouselMedia
                        media={displayMedia}
                        isVisible={index === selectedIndex}
                        isAdjacent={
                          Math.abs(index - selectedIndex) === 1 ||
                          (selectedIndex === -1 && index === 0)
                        }
                        className="object-cover"
                        alt={project.title}
                        priority={index === 0}
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Mobile Text bubbles */}
          <div
            className="absolute flex flex-col-reverse overflow-visible transition-all duration-500 ease-out z-30"
            style={{
              bottom: getTextBubblesBottom(),
              right: '50px',
              gap: '16px'
            }}
          >
            {projects.map((project, index) => {
              const isSelected = selectedIndex === index
              const collapsedHeight = 18
              const collapsedWidth = 12
              const expandedHeight = 36

              return (
                <div
                  key={`${project.slug}-${index}`}
                  className="cursor-pointer flex-shrink-0 flex justify-end items-center transition-all duration-1000 ease-out"
                  onClick={() => handleThumbnailClick(index, project)}
                  style={{
                    height: isSelected ? `${expandedHeight}px` : `${collapsedHeight}px`
                  }}
                >
                  <div
                    className="font-ui flex items-center justify-end transition-all duration-1000 ease-out"
                    style={{
                      height: isSelected ? `${expandedHeight}px` : `${collapsedHeight}px`,
                      width: isSelected ? 'auto' : `${collapsedWidth}px`,
                      paddingLeft: isSelected ? '16px' : '0px',
                      paddingRight: isSelected ? '29px' : '0px',
                      fontSize: '0.85em',
                      fontWeight: 'normal',
                      borderRadius: '0px',
                      backgroundColor: isSelected ? 'white' : 'black',
                      color: isSelected ? 'black' : 'white',
                      overflow: 'visible',
                      whiteSpace: 'nowrap',
                      animation: !isSelected && selectedIndex === -1 ? `bubbleWave 4s ease-in-out infinite` : 'none',
                      animationDelay: `${index * 0.3}s`
                    }}
                  >
                    {isSelected && <span style={{ paddingRight: '12px' }}>{project.title}</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Swipe Up Icon and Text - centered above card peek */}
        {showSwipeIndicator && viewportHeight > 0 && (
          <div
            className="fixed z-40 pointer-events-none flex flex-col items-center"
            style={{
              left: '50%',
              transform: 'translateX(-50%)',
              bottom: `${viewportHeight * 0.1 + 50 + 49}px`,
              animation: 'iconBobAndFade 5s ease-in-out forwards'
            }}
          >
            <img
              src="https://res.cloudinary.com/dxmq5ewnv/image/upload/v1772578707/swipeUp_bxdyww.svg"
              alt="Swipe up"
              style={{
                width: '52px',
                height: '52px',
                marginBottom: '8px'
              }}
            />
            <span className="font-ui text-white text-sm">swipe up</span>
          </div>
        )}

        {/* Subtle Card Peek - appears after 5 seconds to hint swipeability */}
        {showSwipeIndicator && viewportHeight > 0 && (
          <div
            className="fixed left-0 right-0 bottom-0 z-30 pointer-events-none"
            style={{
              height: `${viewportHeight * 0.06}px`,
              animation: 'cardPeek 5s ease-in-out forwards',
              transformOrigin: 'bottom'
            }}
          >
            {projects.length > 0 && projects[0] && (
              <div className="w-full h-full px-3">
                <div
                  className="w-full h-full overflow-hidden"
                  style={{
                    borderTopLeftRadius: '24px',
                    borderTopRightRadius: '24px'
                  }}
                >
                  <div style={{
                    width: '100%',
                    height: `${viewportHeight}px`,
                    transform: 'translateY(-94%)'
                  }}>
                    <CarouselMedia
                      media={projects[0].reel || projects[0].cover}
                      isVisible={true}
                      isAdjacent={false}
                      priority={false}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
