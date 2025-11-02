import { generateMetadata as genMeta } from '@/lib/metadata'
import PageLayout from '@/layouts/PageLayout'
import InfoBlock from '@/components/InfoBlock'
import TipBlock from '@/components/TipBlock'

export const metadata = genMeta({
  title: 'Why Build a K3s Homelab Cluster',
  description: 'Why I built a Raspberry Pi K3s cluster. Learn about the motivation, key premises, and purpose behind this homelab project.',
  path: '/motivation',
  keywords: ['homelab motivation', 'why kubernetes', 'devops learning', 'raspberry pi cluster benefits'],
})

export default function MotivationPage() {
  const tocSections = [
    { id: 'key-premisses', label: 'Key Premisses' },
    { id: 'purpose', label: 'Purpose' },
  ]

  return (
    <PageLayout
      title="Motivation"
      subtitle="Why I built this and what I learned from my previous setup."
      tocSections={tocSections}
      prevPage={{ href: '/', label: 'INTRODUCTION' }}
      nextPage={{ href: '/hardware', label: 'HARDWARE' }}
    >
      <div className="space-y-12">
        <section id="key-premisses">
          <h2 className="text-3xl font-semibold mb-6 text-white font-mono">Key Premisses</h2>
          <p className="text-gray-400 mb-6 font-mono">
            Here are the key premisses I established at the start of my project:
          </p>

          <ol className="space-y-6 list-decimal list-inside text-gray-300 font-mono">
            <li className="leading-relaxed">
              <span className="font-bold text-white">Node Amount:</span> I currently have 3 nodes (2x Raspberry Pi 5 + 1x Raspberry Pi 4), planning to expand to 4 nodes for better workload distribution.
            </li>
            <li className="leading-relaxed">
              <span className="font-bold text-white">Network Infrastructure:</span> Using MikroTik CSS610-8G-2S+IN switch for reliable connectivity between cluster nodes.
            </li>
            <li className="leading-relaxed">
              <span className="font-bold text-white">Portability & Efficiency:</span> Switched to Raspberry Pi cluster for lower power consumption, quieter operation, and better portability.
            </li>
            <li className="leading-relaxed">
              <span className="font-bold text-white">Technology Stack:</span> K3s cluster managed by Rancher, ArgoCD for GitOps, Grafana + Prometheus for monitoring and observability.
            </li>
            <li className="leading-relaxed">
              <span className="font-bold text-white">Practical Learning:</span> Real production-like environment to experiment with DevOps practices and infrastructure automation.
            </li>
          </ol>

          <div className="mt-8">
            <InfoBlock>
              Before this setup, I ran a traditional tower server. The transition to Raspberry Pi brings better energy efficiency, silent operation, and hands-on experience with ARM-based distributed systems.
            </InfoBlock>
          </div>
        </section>

        <section id="purpose" className="mt-16">
          <h2 className="text-3xl font-semibold mb-6 text-white font-mono">Purpose</h2>
          <p className="text-gray-300 font-mono leading-relaxed mb-4">
            The purpose of this build is to create a production-like playground where I can learn and experiment with Kubernetes (K3s), GitOps workflows using ArgoCD, comprehensive monitoring with Grafana and Prometheus, Docker containerization, CI/CD pipelines, and infrastructure as code.
          </p>
          <p className="text-gray-300 font-mono leading-relaxed mb-6">
            My previous server experience taught me the value of enterprise capabilities, but I wanted something more efficient and flexible. The Raspberry Pi cluster offers the perfect balance between cost, power consumption, and learning opportunities for cloud-native technologies.
          </p>

          <TipBlock>
            <span className="font-bold">Ultimately, I want a scalable environment where I can explore modern DevOps tools, experiment with distributed systems, and continuously expand my infrastructure knowledge.</span>
          </TipBlock>
        </section>
      </div>
    </PageLayout>
  )
}
