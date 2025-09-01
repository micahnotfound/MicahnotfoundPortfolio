'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface GalleryImage {
  id: string
  src: string
  alt: string
  caption?: string
  width: number
  height: number
}

interface AdaptiveGridProps {
  images: GalleryImage[]
  className?: string
}

export function AdaptiveGrid({ images, className = '' }: AdaptiveGridProps) {
  const [gridRows, setGridRows] = useState<GalleryImage[][]>([])

  // Calculate image dimensions and create optimal grid layout
  useEffect(() => {
    if (!images.length) return

    const rows: GalleryImage[][] = []
    let currentRow: GalleryImage[] = []
    let currentRowWidth = 0
    const maxRowWidth = 1200 // Base width for calculations

    images.forEach((image) => {
      const aspectRatio = image.width / image.height
      const isLandscape = aspectRatio > 1
      const imageWidth = isLandscape ? 600 : 400 // Landscape images get more width

      // Check if we should start a new row
      const shouldStartNewRow = 
        currentRowWidth + imageWidth > maxRowWidth || // Would exceed max width
        currentRow.length >= 3 || // Already have 3 images
        (currentRow.length === 2 && !currentRow.some(img => img.width / img.height > 1) && !isLandscape) // Need landscape minimum

      if (shouldStartNewRow && currentRow.length > 0) {
        // Complete current row
        rows.push([...currentRow])
        currentRow = []
        currentRowWidth = 0
      }

      // Add image to current row
      currentRow.push(image)
      currentRowWidth += imageWidth
    })

    // Add the last row if it has content
    if (currentRow.length > 0) {
      rows.push(currentRow)
    }

    setGridRows(rows)
  }, [images])

  if (!images.length) return null

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {gridRows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={`grid gap-4 ${
            row.length === 1
              ? 'grid-cols-1'
              : row.length === 2
              ? 'grid-cols-2'
              : 'grid-cols-3'
          }`}
        >
          {row.map((image, imageIndex) => {
            const aspectRatio = image.width / image.height
            const isLandscape = aspectRatio > 1
            
            return (
              <div
                key={image.id}
                className="relative overflow-hidden bg-gray-100"
              >
                <div
                  className="relative w-full"
                  style={{
                    aspectRatio: `${image.width}/${image.height}`,
                  }}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  
                  {/* Image overlay with caption */}
                  {image.caption && (
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300 group">
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-sm font-medium">{image.caption}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
