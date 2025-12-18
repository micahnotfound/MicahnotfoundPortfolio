'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MorphingHeaderLogo } from '@/components/shared/MorphingHeaderLogo'

export default function AboutPage() {
  const [logoScale, setLogoScale] = useState(1) // Start at normal homepage scale

  const aboutText = "Kinfolk Tech leverages over six years of leadership in AR and XR innovation to design award-winning educational and cultural experiences. As Chief Strategy Officer, the focus centers on directing creative vision and strategy for public exhibitions and immersive educational tools. Collaborating with schools, cultural institutions, and global brands, the team curates dynamic digital narratives, extending the reach of underrepresented stories in impactful ways.\n\nBy managing multidisciplinary teams and fostering cross-sector partnerships, Kinfolk Tech creates engaging digital monuments and exhibitions featured in prestigious spaces like MoMA and Tribeca Festival. The mission is to integrate art, equity, and technology into transformative experiences, reimagining how audiences connect with history and culture. Values of inclusion and collaboration drive efforts to amplify diverse narratives in public and educational contexts."

  // Trigger grow animation on mount
  useEffect(() => {
    // Small delay to ensure component is mounted before animating
    const timer = setTimeout(() => {
      setLogoScale(1.136) // Scale to grow 80px longer (80px / 587px base height ≈ 0.136 additional scale)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#D1D5DB]">
      {/* M Logo - positioned absolutely like homepage */}
      <div className="absolute left-0" style={{ top: '145px', paddingLeft: '100px', zIndex: 10 }}>
        <Link href="/">
          <div
            style={{
              transformOrigin: 'top center',
              transform: `scaleY(${logoScale})`,
              transition: 'transform 800ms ease-out'
            }}
          >
            <MorphingHeaderLogo
              state={0}
              style={{
                width: '325px',
                height: 'auto'
              }}
            />
          </div>
        </Link>
      </div>

      <div style={{ paddingTop: '52px', paddingLeft: '100px', paddingRight: '80px' }}>
        <div className="flex" style={{ gap: '40px' }}>
          {/* Left side: M logo space */}
          <div className="flex-shrink-0" style={{ width: '325px' }}>
            {/* Empty space for M logo */}
          </div>

          {/* Right side: Title, Text, and Photo */}
          <div className="flex" style={{ gap: '40px', paddingTop: '101px', paddingLeft: '20px' }}>
            {/* Text column */}
            <div className="flex flex-col" style={{ width: '615px' }}>
              {/* About Title */}
              <h1 className="text-5xl font-body font-bold text-core-dark leading-none" style={{ fontSize: '3.45rem', marginBottom: '37px' }}>
                About
              </h1>

              {/* About Text */}
              <p className="font-ui text-gray-700 leading-relaxed" style={{ fontSize: '18.4px' }}>
                {aboutText}
              </p>
            </div>

            {/* Photo - aligned to bottom of M (grown by 80px: 637 + 80 = 717px) */}
            <div className="flex items-end" style={{ height: '717px' }}>
              <img
                src="https://res.cloudinary.com/dxmq5ewnv/image/upload/v1756680394/micah_j75jbv.png"
                alt="Micah Milner"
                style={{ maxWidth: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
