'use client'

import Image from 'next/image'
import { buildCloudinaryUrl } from '@/lib/cloudinary'

export default function Blacklands3Page() {
  // Header image with Cloudinary face detection
  const headerImageUrl = buildCloudinaryUrl(
    "v1756775322/Blacklands_H1_okkjx9",
    "c_fill,g_face,q_auto,f_auto"
  )

  return (
    <div className="min-h-screen bg-[#D1D5DB] p-8">
      {/* Fluid container with beveled corners and margins */}
      <div
        className="w-full overflow-hidden relative"
        style={{
          height: 'calc(100vh - 4rem)', // Full height minus margin (2rem top + 2rem bottom)
          borderRadius: '24px'
        }}
      >
        <Image
          src={headerImageUrl}
          alt="BLACKLANDS Header"
          fill
          className="object-cover"
          style={{
            objectPosition: '35% 25%'
          }}
          priority
        />
      </div>
    </div>
  )
}
