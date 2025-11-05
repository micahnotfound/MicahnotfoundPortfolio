'use client'

import { usePathname } from 'next/navigation'
import { Footer } from './Footer'

export function ConditionalFooter() {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  
  return isHomePage ? <Footer /> : null
}