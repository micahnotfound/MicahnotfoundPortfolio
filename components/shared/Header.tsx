import Link from 'next/link'
import { siteSettings } from '@/config/siteSettings'
import { buildLogoUrl } from '@/lib/cloudinary'

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Left Side: Logo, Separator, About */}
          <div className="flex items-center">
            {/* Logo - M logo on desktop, logoWithText on mobile */}
            <Link href="/" className="flex items-center">
              <img
                src={buildLogoUrl('logoWithText')}
                alt="Micah Milner Logo"
                className="h-8 w-auto md:hidden"
              />
              <img
                src="https://res.cloudinary.com/dxmq5ewnv/image/upload/v1756572604/M_logo_u3q1bg.svg"
                alt="Micah Milner Logo"
                className="h-8 w-auto hidden md:block"
              />
            </Link>

            {/* 2px thick black vertical separator */}
            <div className="flex items-center mx-4 lg:mx-8">
              <div className="w-2 h-8 bg-black"></div>
            </div>

            {/* About text */}
            <Link
              href="/about"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-ui font-medium transition-colors duration-200"
            >
              about
            </Link>
          </div>

          {/* Right Side: MICAH MILNER logotype (desktop only) */}
          <div className="hidden md:flex items-center">
            <img 
              src="https://res.cloudinary.com/dxmq5ewnv/image/upload/v1756572604/Micah_text_vlnslw.svg"
              alt="MICAH MILNER"
              className="h-6 lg:h-8 w-auto"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
