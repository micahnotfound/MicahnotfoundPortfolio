"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { siteSettings } from '@/config/siteSettings'
import { buildLogoUrl } from '@/lib/cloudinary'
import { MorphingLogo } from './MorphingLogo'
import { useHover } from '@/contexts/HoverContext'

export function Header() {
  const pathname = usePathname()
  const isAboutPage = pathname === '/about'
  const isHomePage = pathname === '/'
  const { hoverArea } = useHover()

  // Dynamic header height based on hover state (only on homepage)
  const headerHeight = isHomePage && (hoverArea === 'photo' || hoverArea === null) ? 'h-[200px]' : 'h-[138px]'

  return (
    <header className={`${isHomePage ? 'relative' : 'fixed top-0 left-0 right-0'} z-50 bg-white/90 backdrop-blur-sm transition-all duration-500 ease-out`}>
      <div className="w-full max-w-[2000px] px-20 xl:px-[100px]">
        <div className={`flex justify-between items-center ${headerHeight} py-4 mt-[5px] mb-[10px] transition-all duration-500 ease-out`}>
                    {/* Left Side: Logo, Separator, About/Work */}
          <div className="flex items-center">
            {/* Morphing Logo */}
            <Link href="/" className="flex items-center">
              <MorphingLogo hoverArea={hoverArea} isHomePage={isHomePage} />
            </Link>

            {/* 2px thick core-dark vertical separator */}
            <div className="flex items-center mx-8 lg:mx-16">
              <div className="w-2 h-24 bg-core-dark"></div>
            </div>

            {/* About/Work text */}
            <Link
              href={isAboutPage ? "/" : "/about"}
              className="border-[5px] border-core-dark px-4 py-1 text-center font-ui font-bold text-core-dark hover:bg-core-dark hover:text-white transition-colors duration-200 text-[0.95em]"
              data-cursor-hover
            >
              {isAboutPage ? "work" : "about"}
            </Link>

            {/* Contact button - links to contact page */}
            <Link
              href="/contact"
              className="border-[5px] border-core-dark px-4 py-1 text-center font-ui font-bold text-core-dark hover:bg-core-dark hover:text-white transition-colors duration-200 text-[0.95em]"
              style={{ marginLeft: '57px' }}
              data-cursor-hover
            >
              contact
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
