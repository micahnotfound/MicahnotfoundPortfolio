"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { siteSettings } from '@/config/siteSettings'
import { buildLogoUrl } from '@/lib/cloudinary'

export function Header() {
  const pathname = usePathname()
  const isAboutPage = pathname === '/about'
  const isHomePage = pathname === '/'
  

  return (
    <header className={`${isHomePage ? 'relative' : 'fixed top-0 left-0 right-0'} z-50 bg-white/90 backdrop-blur-sm`}>
      <div className="w-full max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-32 py-4">
          {/* Left Side: Logo, Separator, About/Work */}
          <div className="flex items-center">
            {/* Logo - M logo on desktop, logoWithText on mobile */}
            <Link href="/" className="flex items-center">
              <img
                src={buildLogoUrl('logoWithText')}
                alt="Micah Milner Logo"
                className="h-16 w-auto md:hidden"
              />
              <img
                src="https://res.cloudinary.com/dxmq5ewnv/image/upload/v1756572604/M_logo_u3q1bg.svg"
                alt="Micah Milner Logo"
                className="h-16 w-auto hidden md:block"
              />
            </Link>

            {/* 2px thick core-dark vertical separator */}
            <div className="flex items-center mx-4 lg:mx-8">
              <div className="w-2 h-24 bg-core-dark"></div>
            </div>

            {/* About/Work text */}
            <Link
              href={isAboutPage ? "/" : "/about"}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-2xl font-ui font-medium transition-colors duration-200"
            >
              {isAboutPage ? "work" : "about"}
            </Link>
          </div>

          {/* Right Side: MICAH MILNER logotype (desktop only) */}
          <div className="hidden md:flex items-center px-4">
            <Link href="/" className="hover:opacity-80 transition-opacity duration-200">
              <img 
                src="https://res.cloudinary.com/dxmq5ewnv/image/upload/v1756572604/Micah_text_vlnslw.svg"
                alt="MICAH MILNER"
                className="h-8 w-auto"
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
