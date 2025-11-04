import { generateMetadata as genMeta } from '@/lib/metadata'
import PageLayout from '@/layouts/PageLayout'
import Image from 'next/image'

export const metadata = genMeta({
  title: 'Motivation — Why Build This Cluster',
  description: 'From a noisy tower server to a quiet, scalable DevOps lab. A hands-on journey toward mastering Kubernetes, GitOps, and modern cloud-native infrastructure.',
  path: '/motivation',
  keywords: ['homelab motivation', 'devops lab', 'raspberry pi cluster', 'kubernetes learning', 'infrastructure as code'],
})

export default function MotivationPage() {
  const tocSections = [
    { id: 'journey', label: 'The Journey' },
    { id: 'before-after', label: 'Before & After' },
    { id: 'philosophy', label: 'Philosophy' },
  ]

  return (
    <PageLayout
      title="Motivation"
      subtitle="From a noisy tower to a quiet, scalable DevOps lab"
      tocSections={tocSections}
      prevPage={{ href: '/', label: 'INTRODUCTION' }}
      nextPage={{ href: '/hardware', label: 'HARDWARE' }}
    >
      <div className="space-y-16">
        {/* The Journey */}
        <section id="journey">
          <h2 className="text-3xl font-semibold mb-6 text-white font-mono">The Journey</h2>
          <div className="space-y-4 text-gray-300 font-mono leading-relaxed">
            <p>
              For years I relied on a traditional tower server for experiments — it worked, but it was loud, power-hungry, and not exactly "portable." What I really wanted was something smaller, quieter, and more flexible — a setup that felt like a real production system but didn't take over my workspace.
            </p>
            <p>
              That's how this Raspberry Pi cluster came to life: a compact and energy-efficient environment that lets me explore DevOps workflows, distributed systems, and automation hands-on.
            </p>
          </div>
        </section>

        {/* Before & After */}
        <section id="before-after">
          <h2 className="text-3xl font-semibold mb-6 text-white font-mono">Before & After</h2>
          <p className="text-gray-400 font-mono mb-8">
            From a loud Dell PowerEdge in a 19" rack to a silent, compact Raspberry Pi cluster.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Before - Old Homelab */}
            <div>
              <div className="relative w-full rounded-lg overflow-hidden border border-gray-600 shadow-lg mb-4">
                <Image
                  src="/images/old-homelab.webp"
                  alt="Old Homelab - Dell PowerEdge Server"
                  width={600}
                  height={800}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                  quality={85}
                />
              </div>
              <div className="text-center">
                <h3 className="text-lg sm:text-xl font-semibold text-red-400 mb-2 font-mono">❌ Before</h3>
                <ul className="text-xs sm:text-sm text-gray-400 font-mono space-y-1 text-left">
                  <li>• Loud server fans</li>
                  <li>• High power consumption</li>
                  <li>• Large 19" rack footprint</li>
                  <li>• Heat generation</li>
                </ul>
              </div>
            </div>

            {/* After - New Raspberry Pi Cluster */}
            <div>
              <div className="relative w-full rounded-lg overflow-hidden border border-[#ff8c00] shadow-lg mb-4">
                <Image
                  src="/images/pi5.webp"
                  alt="New Homelab - Raspberry Pi Cluster"
                  width={600}
                  height={800}
                  className="w-full h-auto object-cover"
                  priority
                  quality={85}
                />
              </div>
              <div className="text-center">
                <h3 className="text-lg sm:text-xl font-semibold text-green-400 mb-2 font-mono">✓ After</h3>
                <ul className="text-xs sm:text-sm text-gray-400 font-mono space-y-1 text-left">
                  <li>• Silent operation</li>
                  <li>• Energy efficient (~20W)</li>
                  <li>• Compact design</li>
                  <li>• ARM architecture</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section id="philosophy" className="mt-16">
          <h2 className="text-3xl font-semibold mb-6 text-white font-mono">Philosophy</h2>
          <div className="bg-gradient-to-r from-[#111111] to-[#0a0a0a] border border-[#ff8c00] rounded-lg p-4 sm:p-6 lg:p-8">
            <p className="text-gray-300 font-mono leading-relaxed text-base sm:text-lg mb-4">
              Ultimately, this project is less about hardware and more about <span className="text-[#ff8c00] font-bold">mindset</span>:
            </p>
            <div className="space-y-3 text-gray-400 font-mono">
              <p className="flex items-start">
                <span className="text-[#ff8c00] mr-3">→</span>
                <span>Creating, observing, breaking things, fixing them</span>
              </p>
              <p className="flex items-start">
                <span className="text-[#ff8c00] mr-3">→</span>
                <span>Continuously evolving toward a deeper understanding of modern cloud-native infrastructure</span>
              </p>
              <p className="flex items-start">
                <span className="text-[#ff8c00] mr-3">→</span>
                <span>Mastering distributed systems through hands-on practice</span>
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  )
}
