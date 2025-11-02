import { generateMetadata as genMeta } from '@/lib/metadata'
import PageLayout from '@/layouts/PageLayout'
import Accordion, { AccordionItem } from '@/components/Accordion'

export const metadata = genMeta({
  title: 'Raspberry Pi Cluster Hardware Specs',
  description: 'Complete hardware specifications for Raspberry Pi K3s cluster. Raspberry Pi 5, Pi 4, MikroTik switch, NVMe storage, and rack setup details.',
  path: '/hardware',
  keywords: ['raspberry pi 5', 'raspberry pi 4', 'mikrotik switch', 'nvme storage', 'deskpi rack'],
})

export default function HardwarePage() {
  const tocSections = [
    { id: 'component-list', label: 'Component List' },
    { id: 'feedback-community', label: 'Feedback & Community' },
  ]

  const hardwareItems: AccordionItem[] = [
    {
      id: 'minirack',
      title: 'MiniRack',
      icon: (
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      content: (
        <div className="pl-8">
          <h3 className="font-semibold text-white mb-2 font-mono mt-4">DeskPi RackMate T0</h3>
          <p className="text-sm text-gray-400 font-mono">
            - A tiny 10-inch 4U aluminium rack that keeps everything organized. Currently lives in my closet while I figure out the perfect desk setup for it.
          </p>
        </div>
      ),
    },
    {
      id: 'router',
      title: 'Router',
      icon: (
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
      ),
      content: (
        <div className="pl-8">
          <h3 className="font-semibold text-white mb-2 font-mono mt-4">TP-Link Deco M4 Mesh System (3 units)</h3>
          <p className="text-sm text-gray-400 font-mono mb-2">
            - Mesh Wi-Fi system providing seamless coverage across the home/office.
          </p>
          <ul className="text-sm text-gray-400 font-mono space-y-1 ml-4">
            <li>• Main unit: Acts as primary router</li>
            <li>• Unit 2: Positioned near the cluster for optimal connectivity</li>
            <li>• Unit 3: Located near my PC workstation</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'switch',
      title: 'Switch',
      icon: (
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      ),
      content: (
        <div className="pl-8">
          <h3 className="font-semibold text-white mb-2 font-mono mt-4">MikroTik CSS610-8G-2S+IN</h3>
          <p className="text-sm text-gray-400 font-mono">
            - 8-port Gigabit Ethernet + 2x SFP+ switch for reliable cluster connectivity.
          </p>
        </div>
      ),
    },
    {
      id: 'compute',
      title: 'Compute',
      icon: (
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
      content: (
        <div className="pl-8 space-y-4">
          <div className="mt-4">
            <h3 className="font-semibold text-white mb-2 font-mono">2x Raspberry Pi 5 (8GB)</h3>
            <p className="text-sm text-gray-400 font-mono">
              - Latest generation RPi with improved performance for K3s worker nodes.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2 font-mono">1x Raspberry Pi 4 Model B (4GB)</h3>
            <p className="text-sm text-gray-400 font-mono">
              - Previous gen RPi, still powerful enough for cluster workloads.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-2 font-mono">M.2 NVMe SSD Storage</h3>
            <p className="text-sm text-gray-400 font-mono">
              - High-performance storage: 2x Samsung 960 EVO 256GB for RPi 5, 1x Kingston 1TB for RPi 4.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'power',
      title: 'Power',
      icon: (
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      content: (
        <div className="pl-8">
          <h3 className="font-semibold text-white mb-2 font-mono mt-4">USB-C Power Supply</h3>
          <p className="text-sm text-gray-400 font-mono mb-2">
            - Current: 300W multi-port PSU (1x 100W port, remaining ports at 60W each)
          </p>
          <p className="text-sm text-gray-400 font-mono mb-2">
            - Planned upgrade: 800W PSU with all ports at 100W for proper 25W (5A) delivery per Raspberry Pi
          </p>
          <p className="text-sm text-gray-500 font-mono text-xs">
            * Current PSU provides only 15W (3A) per port, insufficient for stable operation (25W / 5A recommended)
          </p>
        </div>
      ),
    },
  ]

  return (
    <PageLayout
      title="Hardware"
      subtitle={<>This hardware setup is heavily inspired by Jeff Geerling's <a href="https://www.jeffgeerling.com/blog/2022/mini-rack-002" target="_blank" rel="noopener noreferrer" className="text-[#ff8c00] hover:underline font-bold">Mini Rack 002</a> - a fantastic reference for anyone building a compact homelab cluster.</>}
      tocSections={tocSections}
      prevPage={{ href: '/motivation', label: 'MOTIVATION' }}
      nextPage={{ href: '/networking', label: 'NETWORKING' }}
    >
      <section id="component-list">
        <h2 className="text-3xl font-semibold mb-6 text-white font-mono">Component List</h2>
        <Accordion items={hardwareItems} />
      </section>

      <section id="feedback-community" className="mt-16">
        <h2 className="text-3xl font-semibold mb-4 text-white font-mono">Feedback & Community</h2>
        <p className="text-gray-400 font-mono mb-8">
          I've noticed that many people share their homelab builds to inspire others and exchange ideas. If you're interested in seeing different approaches and creative solutions, check out Jeff's Project MiniRack community - there's a lot of inspiring builds to explore!
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <a 
            href="https://github.com/geerlingguy/mini-rack/issues?q=is%3Aissue%20state%3Aopen%20label%3A%22build%20showcase%22" 
            target="_blank" 
            rel="noopener noreferrer"
            className="border border-[#2a2a2a] bg-[#111111] rounded-lg p-6 hover:border-[#ff8c00] transition group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-[#ff8c00] rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </div>
              <svg className="w-5 h-5 text-gray-600 group-hover:text-[#ff8c00] transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            <h3 className="font-semibold text-white mb-2 font-mono text-lg">MiniRack Build Showcases</h3>
            <p className="text-sm text-gray-400 font-mono">Check out other people's builds and get inspired!</p>
          </a>
        </div>
      </section>
    </PageLayout>
  )
}
