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
      <div className="w-full max-w-[2000px] px-20 xl:px-[100px]">
        <div className="flex justify-between items-center h-32 py-4 mt-[5px] mb-[10px]">
                    {/* Left Side: Logo, Separator, About/Work */}
          <div className="flex items-center">
            {/* Logo - logoWithText for all screen sizes */}
            <Link href="/" className="flex items-center">
              <img
                src={buildLogoUrl('logoWithText')}
                alt="Micah Milner Logo"
                className="h-[90px] w-auto"
              />
            </Link>

            {/* 2px thick core-dark vertical separator */}
            <div className="flex items-center mx-8 lg:mx-16">
              <div className="w-2 h-24 bg-core-dark"></div>
            </div>

            {/* About/Work text */}
            <Link
              href={isAboutPage ? "/" : "/about"}
              className="border-[5px] border-core-dark px-4 py-1 text-center font-ui font-bold text-core-dark hover:bg-core-dark hover:text-white transition-colors duration-200 text-[0.95em]"
            >
              {isAboutPage ? "work" : "about"}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
