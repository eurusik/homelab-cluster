import IpTable from '@/components/IpTable'
import PageNavigation from '@/components/PageNavigation'
import TableOfContents from '@/components/TableOfContents'
import TipBlock from '@/components/TipBlock'
import NetworkDiagram from '@/components/NetworkDiagram'

export default function NetworkingPage() {
  const tocSections = [
    { id: 'network-topology', label: 'Network Topology' },
    { id: 'static-ip', label: 'Static IP Assignment' },
  ]

  const ipTableData = [
    { device: 'Router', role: 'Default gateway', ipv4: '192.168.8.1' },
    { device: 'Switch', role: 'Layer-2 switch', ipv4: '192.168.8.2' },
    { device: 'RpiMaster', role: 'Compute node', ipv4: '192.168.8.5' },
    { device: 'RpiNode #1', role: 'Compute node', ipv4: '192.168.8.6' },
    { device: 'RpiNode #2', role: 'Compute node', ipv4: '192.168.8.7' },
    { device: 'RpiNode #3 (soon)', role: 'Compute node', ipv4: '192.168.8.8' },
  ]

  return (
    <div className="flex max-w-7xl mx-auto">
      {/* Main Content */}
      <div className="flex-1 px-8 py-12 max-w-4xl">
        <h2 className="text-sm text-[#ff8c00] font-mono mb-2">My Homelab</h2>
        <h1 className="text-5xl font-bold mb-8 text-white font-mono">Networking</h1>
        
        <p className="text-xl text-gray-400 mb-12 font-mono">
          Setup for consistent behaviour while being portable.
        </p>

        <section id="network-topology" className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 text-white font-mono">Network Topology</h2>
          <p className="text-gray-400 mb-6 font-mono">
            My homelab network is built for portability and consistency. The TP-Link Deco M4 mesh system provides connectivity wherever I am, with the MikroTik switch connecting all Raspberry Pi nodes:
          </p>

          <NetworkDiagram chart={`
graph TB
    Router["TP-Link Deco M4<br/>192.168.8.1"]:::router
    Switch["MikroTik CSS610<br/>192.168.8.2"]:::switch
    
    RPi5_1["RpiMaster<br/>Raspberry Pi 5 8GB<br/>192.168.8.5"]:::node
    RPi5_2["RpiNode #1<br/>Raspberry Pi 5 8GB<br/>192.168.8.6"]:::node
    RPi4["RpiNode #2<br/>Raspberry Pi 4 4GB<br/>192.168.8.7"]:::node
    RPi_Future["RpiNode #3<br/>(soon)<br/>192.168.8.8"]:::nodeFuture
    
    Router --> Switch
    Switch --> RPi5_1
    Switch --> RPi5_2
    Switch --> RPi4
    Switch -.-> RPi_Future
    
    classDef router fill:#4a4a4a,stroke:#ff8c00,stroke-width:2px,color:#e0e0e0
    classDef switch fill:#1a5f7a,stroke:#4a9eff,stroke-width:2px,color:#e0e0e0
    classDef node fill:#7a1a1a,stroke:#ff4a4a,stroke-width:2px,color:#e0e0e0
    classDef nodeFuture fill:#2a2a2a,stroke:#ff4a4a,stroke-width:2px,stroke-dasharray: 5 5,color:#808080
          `} />
        </section>

        <section id="static-ip">
          <h2 className="text-3xl font-semibold mb-6 text-white font-mono">Static IP Assignment</h2>
          <p className="text-gray-400 mb-6 font-mono">
            In my homelab, I require identical network behavior whether I'm at home, in the office, or on the road. To achieve this, I assign static IP addresses to my core devices on the 192.168.8.0/24 network:
          </p>

          <IpTable rows={ipTableData} />

          <div className="mt-8">
            <TipBlock>
              This way, no matter where I plug in, I always reach the same IPs.
            </TipBlock>
          </div>
        </section>

        {/* Navigation Buttons */}
        <PageNavigation 
          prevPage={{ href: '/hardware', label: 'HARDWARE' }}
          nextPage={{ href: '/architecture', label: 'K3S ARCHITECTURE' }}
        />

        {/* Footer */}
        <footer className="border-t border-[#2a2a2a] pt-8 mt-12">
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-300 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-300 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
            <p className="text-gray-500 text-sm font-mono">Powered by Next.js</p>
          </div>
        </footer>
      </div>

      {/* Right Sidebar - On this page */}
      <TableOfContents sections={tocSections} />
    </div>
  )
}
