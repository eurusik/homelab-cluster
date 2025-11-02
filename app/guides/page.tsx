import Link from 'next/link'
import { generateMetadata as genMeta } from '@/lib/metadata'
import InfoBlock from '@/components/InfoBlock'

export const metadata = genMeta({
  title: 'K3s Cluster Setup Guides',
  description: 'Step-by-step guides for setting up Raspberry Pi cluster, installing K3s, and deploying high availability Kubernetes with Ansible.',
  path: '/guides',
  keywords: ['raspberry pi setup', 'k3s installation', 'ansible automation', 'kubernetes tutorial'],
})

export default function GuidesPage() {
  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      <h1 className="text-4xl font-bold mb-4 dark:text-white">Setup Guides</h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
        Step-by-step instructions to build your own cluster.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/guides/setup-raspberry-pi" className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-blue-500 dark:hover:border-blue-500 transition">
          <div className="text-4xl mb-4">🥧</div>
          <h2 className="text-2xl font-semibold mb-2 dark:text-white">Setup Raspberry Pis</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Prepare your Raspberry Pi boards with the operating system and initial configuration.
          </p>
          <div className="mt-4 text-blue-500 font-medium">Read guide →</div>
        </Link>

        <Link href="/guides/install-k3s" className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-blue-500 dark:hover:border-blue-500 transition">
          <div className="text-4xl mb-4">☸️</div>
          <h2 className="text-2xl font-semibold mb-2 dark:text-white">Install K3s</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Deploy K3s on your cluster and configure master and worker nodes.
          </p>
          <div className="mt-4 text-blue-500 font-medium">Read guide →</div>
        </Link>

        <Link href="/guides/k3s-ha-ansible" className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:border-blue-500 dark:hover:border-blue-500 transition">
          <div className="text-4xl mb-4">🚀</div>
          <h2 className="text-2xl font-semibold mb-2 dark:text-white">K3s HA with Ansible</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Fully automated High Availability K3s installation using etcd, MetalLB, and kube-vip.
          </p>
          <div className="mt-4 text-blue-500 font-medium">Read guide →</div>
        </Link>
      </div>

      <div className="mt-12">
        <InfoBlock>
          <span className="font-bold">Before You Begin:</span>
          <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
            <li>Make sure you have all the required hardware components</li>
            <li>Download Raspberry Pi OS (64-bit) image</li>
            <li>Have a computer with SD card reader available</li>
            <li>Ensure stable internet connection for downloads</li>
          </ul>
        </InfoBlock>
      </div>
    </div>
  )
}
