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
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-2 md:p-8 overflow-y-auto"
          onClick={() => setSelectedIdx(null)}
        >
          <div className="relative w-full flex flex-col" onClick={e => e.stopPropagation()}>
            {/* Close button */}
            <button
              onClick={() => setSelectedIdx(null)}
              className="absolute top-4 right-4 z-10 w-12 h-12 md:w-14 md:h-14 bg-[#ff8c00] hover:bg-[#ff9f1f] text-white rounded-lg flex items-center justify-center transition-all cursor-pointer hover:scale-110 shadow-lg"
              aria-label="Close gallery"
            >
              <span className="text-2xl font-bold">✕</span>
            </button>

            {/* Image container - allow natural scaling */}
            <div className="flex items-center justify-center my-8">
              <Image
                src={images[selectedIdx]}
                alt={`${postTitle} - Full image ${selectedIdx + 1}`}
                width={1200}
                height={800}
                quality={85}
                className="max-w-full max-h-[80vh] w-auto h-auto"
                priority
              />
            </div>

            {/* Navigation - below image */}
            <div className="flex flex-col items-center justify-center gap-3 pb-4 md:pb-6">
              <div className="flex gap-2 md:gap-4 items-center bg-black/70 rounded-lg p-3 md:p-4">
                <button
                  onClick={() => setSelectedIdx(prev => (prev! - 1 + images.length) % images.length)}
                  className="px-3 md:px-4 py-2 bg-[#ff8c00] hover:bg-[#ff9f1f] text-white font-mono text-sm rounded transition-colors"
                  aria-label="Previous image"
                >
                  ← Prev
                </button>
                <span className="px-2 md:px-4 py-2 text-gray-300 font-mono text-sm whitespace-nowrap">
                  {selectedIdx + 1} / {images.length}
                </span>
                <button
                  onClick={() => setSelectedIdx(prev => (prev! + 1) % images.length)}
                  className="px-3 md:px-4 py-2 bg-[#ff8c00] hover:bg-[#ff9f1f] text-white font-mono text-sm rounded transition-colors"
                  aria-label="Next image"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
