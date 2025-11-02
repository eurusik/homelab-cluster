import { generateMetadata as genMeta } from '@/lib/metadata'
import PageLayout from '@/layouts/PageLayout'
import IpTable from '@/components/IpTable'
import DnsTable from '@/components/DnsTable'
import TipBlock from '@/components/TipBlock'
import MermaidDiagram from '@/components/MermaidDiagram'

export const metadata = genMeta({
  title: 'Network Configuration & IP Planning',
  description: 'Physical network infrastructure for the Raspberry Pi K3s cluster. Static IP configuration, DNS setup, and mesh network topology.',
  path: '/networking',
  keywords: ['network topology', 'static ip', 'dns', 'mikrotik', 'mesh network'],
})

export default function NetworkingPage() {
  const tocSections = [
    { id: 'network-topology', label: 'Network Topology' },
    { id: 'static-ip', label: 'Static IP Assignment' },
    { id: 'dns-aliases', label: 'DNS Aliases' },
  ]

  const ipTableData = [
    { device: 'Router', role: 'Default gateway', ipv4: '192.168.88.1' },
    { device: 'Switch', role: 'Layer-2 switch', ipv4: '192.168.88.2' },
    { device: 'RpiMaster', role: 'Master node', ipv4: '192.168.88.5' },
    { device: 'RpiWorker #1', role: 'Worker node', ipv4: '192.168.88.6' },
    { device: 'RpiWorker #2', role: 'Worker node', ipv4: '192.168.88.7' },
  ]

  const dnsTableData = [
    { alias: 'home.lab.router', targetIp: '192.168.88.1', purpose: 'Router UI' },
    { alias: 'home.lab.switch', targetIp: '192.168.88.2', purpose: 'Switch UI' },
  ]

  return (
    <PageLayout
      title="Networking"
      subtitle="The physical network infrastructure that sits beneath the K3s cluster."
      tocSections={tocSections}
      prevPage={{ href: '/hardware', label: 'HARDWARE' }}
      nextPage={{ href: '/architecture', label: 'K3S ARCHITECTURE' }}
    >

        <section id="network-topology" className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 text-white font-mono">Network Topology</h2>
          <p className="text-gray-400 mb-6 font-mono">
            My homelab network is built for portability and consistency. The TP-Link Deco M4 mesh system consists of a main router and two satellite nodes—one extending coverage to my workstation, and another positioned at the cluster to provide reliable connectivity to all Raspberry Pi nodes through the MikroTik switch:
          </p>

          <MermaidDiagram chart={`
graph TB
    PC["PC/Laptop"]:::device
    DecoMain["TP-Link Deco M4<br/>(Main Router)<br/>192.168.88.1"]:::router
    DecoPC["TP-Link Deco M4<br/>(Workstation Node)"]:::satellite
    DecoServer["TP-Link Deco M4<br/>(Cluster Node)"]:::satellite
    Switch["MikroTik CSS610<br/>192.168.88.2"]:::switch
    
    RPi5_Master["RpiMaster<br/>Raspberry Pi 5 8GB<br/>192.168.88.5"]:::master
    RPi4_Worker["RpiWorker #1<br/>Raspberry Pi 4 4GB<br/>192.168.88.6"]:::worker
    RPi5_Worker["RpiWorker #2<br/>Raspberry Pi 5 8GB<br/>192.168.88.7"]:::worker
    
    DecoMain -.->|Mesh| DecoPC
    DecoMain -.->|Mesh| DecoServer
    PC --> DecoPC
    DecoServer --> Switch
    Switch --> RPi5_Master
    Switch --> RPi4_Worker
    Switch --> RPi5_Worker
    
    classDef device fill:#2a2a2a,stroke:#808080,stroke-width:2px,color:#e0e0e0
    classDef router fill:#4a4a4a,stroke:#ff8c00,stroke-width:2px,color:#e0e0e0
    classDef satellite fill:#3a3a3a,stroke:#ff8c00,stroke-width:2px,stroke-dasharray: 3 3,color:#e0e0e0
    classDef switch fill:#1a5f7a,stroke:#4a9eff,stroke-width:2px,color:#e0e0e0
    classDef master fill:#7a1a1a,stroke:#ff4a4a,stroke-width:2px,color:#e0e0e0
    classDef worker fill:#1a4a1a,stroke:#4aff4a,stroke-width:2px,color:#e0e0e0
          `} />
        </section>

        <section id="static-ip">
          <h2 className="text-3xl font-semibold mb-6 text-white font-mono">Static IP Assignment</h2>
          <p className="text-gray-400 mb-6 font-mono">
            Static IP assignments ensure predictable addressing and simplify service discovery across the cluster. Each device gets a reserved address on the 192.168.88.0/24 network:
          </p>

          <IpTable rows={ipTableData} />

          <div className="mt-8">
            <TipBlock>
              Static IPs are configured directly on each device. While this requires manual setup per node, it ensures the cluster maintains consistent addressing even if the router is replaced or reset.
            </TipBlock>
          </div>
        </section>

        <section id="dns-aliases" className="mb-16 mt-16">
          <h2 className="text-3xl font-semibold mb-6 text-white font-mono">DNS Aliases for Service Access</h2>
          <p className="text-gray-400 mb-6 font-mono">
            Instead of memorizing IP addresses, I use DNS aliases under the <code className="bg-[#1a1a1a] px-2 py-1 rounded text-[#ff8c00]">home.lab</code> domain. These are configured as local DNS entries on the router, mapping friendly names to the static IPs:
          </p>

          <DnsTable rows={dnsTableData} />
        </section>
    </PageLayout>
  )
}
