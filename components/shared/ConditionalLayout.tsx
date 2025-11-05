'use client'

import { usePathname } from 'next/navigation'
import React, { ReactNode, useEffect, cloneElement, isValidElement } from 'react'

interface ConditionalLayoutProps {
  children: ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  
  useEffect(() => {
    if (isHomePage) {
      // Homepage: fixed viewport height, no vertical scrolling
      document.body.style.overflow = 'hidden'
      document.body.className = 'font-sans antialiased h-screen overflow-hidden'
    } else {
      // Other pages: normal scrolling behavior
      document.body.style.overflow = 'unset'
      document.body.className = 'font-sans antialiased'
    }
    
    return () => {
      // Cleanup on unmount
      document.body.style.overflow = 'unset'
      document.body.className = 'font-sans antialiased'
    }
  }, [isHomePage])
  
  // Clone children and modify main element styling based on page type
  const modifiedChildren = React.Children.map(children, (child) => {
    if (isValidElement(child) && typeof child.type === 'string' && child.type === 'main') {
      return cloneElement(child, {
        className: isHomePage 
          ? 'flex-1 min-h-0' // Homepage: flex layout
          : 'flex-1' // Other pages: normal flex but allow scrolling
      })
    }
    return child
  })
  
  if (isHomePage) {
    // Homepage: fixed height layout with footer
    return (
      <div className="h-screen flex flex-col">
        {modifiedChildren}
      </div>
    )
  } else {
    // Other pages: normal layout with vertical scrolling
    return (
      <div className="min-h-screen flex flex-col">
        {modifiedChildren}
      </div>
    )
  }
}