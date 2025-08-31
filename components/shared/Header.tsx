import Link from 'next/link'
import { siteSettings } from '@/config/siteSettings'

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo (icon + text combined) */}
          <Link href="/" className="flex items-center">
            <span className="text-lg md:text-xl font-heading font-bold text-gray-900">
              {siteSettings.siteTitle}
            </span>
          </Link>
          
          {/* 4px thick black border separator - hidden on mobile */}
          <div className="hidden md:flex flex-1 mx-4 lg:mx-8">
            <div className="h-4 bg-black w-full"></div>
          </div>
          
          {/* About text - hidden on mobile */}
          <Link 
            href="/about" 
            className="hidden md:block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-ui font-medium transition-colors duration-200"
          >
            about
          </Link>
          
          {/* MICAH MILNER logotype - responsive sizing */}
          <div className="text-sm md:text-lg lg:text-xl font-heading font-bold text-gray-900 tracking-wide">
            MICAH MILNER
          </div>
        </div>
      </div>
    </header>
  )
}
