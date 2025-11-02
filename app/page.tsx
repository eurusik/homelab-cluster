import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <div className="mb-4">
        <h2 className="text-sm text-[#ff8c00] font-mono mb-2">My Homelab</h2>
        <h1 className="text-5xl font-bold mb-4 text-white font-mono">Introduction</h1>
        <p className="text-xl text-gray-400 mb-8 font-mono">
          Welcome to my homelab raspberrypi cluster.
        </p>
      </div>

      <div className="mb-12 rounded-lg overflow-hidden border border-[#2a2a2a]">
        <div className="bg-[#1a1a1a] h-96 flex items-center justify-center">
          <p className="text-gray-600 font-mono">[ Cluster Image Placeholder ]</p>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4 text-white font-mono">Special thanks</h2>
        <p className="text-gray-400 mb-6 font-mono leading-relaxed">
          The two main sources that motivated me, and that i based this project on were these two videos from NetworkChuck and Jeff Geerling.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <a href="https://www.youtube.com/watch?v=X9fSMGkjtug" target="_blank" rel="noopener noreferrer" className="border border-[#2a2a2a] bg-[#111111] rounded-lg p-6 hover:border-[#ff8c00] transition group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-[#ff0000] rounded flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <svg className="w-4 h-4 text-gray-600 group-hover:text-[#ff8c00] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            <h3 className="font-semibold text-white mb-2 font-mono">Raspberrypi Super Computer</h3>
            <p className="text-sm text-gray-500 font-mono">Got me started with local Kubernetes</p>
          </a>
          <a href="https://www.youtube.com/watch?v=y1GCIwLm3is" target="_blank" rel="noopener noreferrer" className="border border-[#2a2a2a] bg-[#111111] rounded-lg p-6 hover:border-[#ff8c00] transition group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-[#ff0000] rounded flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <svg className="w-4 h-4 text-gray-600 group-hover:text-[#ff8c00] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            <h3 className="font-semibold text-white mb-2 font-mono">Project Mini Rack</h3>
            <p className="text-sm text-gray-500 font-mono">Made me want to build a minirack setup</p>
          </a>
        </div>
      </section>
    </div>
  )
}
