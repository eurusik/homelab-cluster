'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function BlogGallery({ images, postTitle }: { images: string[]; postTitle: string }) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((imgUrl: string, idx: number) => (
          <button
            key={idx}
            onClick={() => setSelectedIdx(idx)}
            className="relative w-full aspect-video border border-[#2a2a2a] rounded-lg overflow-hidden bg-[#0a0a0a] hover:border-[#ff8c00] hover:opacity-90 transition-all cursor-pointer group"
          >
            <Image
              src={imgUrl}
              alt={`${postTitle} - Image ${idx + 1}`}
              fill
              quality={85}
              loading="lazy"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <svg className="w-12 h-12 text-white/0 group-hover:text-white/80 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedIdx(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <Image
              src={images[selectedIdx]}
              alt={`${postTitle} - Full image ${selectedIdx + 1}`}
              width={1200}
              height={800}
              quality={85}
              className="w-full h-auto rounded-lg"
              priority
            />

            {/* Navigation */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/70 rounded-lg p-2">
              <button
                onClick={() => setSelectedIdx(prev => (prev! - 1 + images.length) % images.length)}
                className="px-4 py-2 bg-[#ff8c00] hover:bg-[#ff9f1f] text-white font-mono text-sm rounded transition-colors"
                aria-label="Previous image"
              >
                ← Prev
              </button>
              <span className="px-4 py-2 text-gray-300 font-mono text-sm">
                {selectedIdx + 1} / {images.length}
              </span>
              <button
                onClick={() => setSelectedIdx(prev => (prev! + 1) % images.length)}
                className="px-4 py-2 bg-[#ff8c00] hover:bg-[#ff9f1f] text-white font-mono text-sm rounded transition-colors"
                aria-label="Next image"
              >
                Next →
              </button>
            </div>

            {/* Close button */}
            <button
              onClick={() => setSelectedIdx(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-black/70 hover:bg-black/90 text-white rounded-lg flex items-center justify-center transition-colors"
              aria-label="Close gallery"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  )
}
