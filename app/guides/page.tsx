import Link from 'next/link'

export default function GuidesPage() {
  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
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
      </div>

      <div className="mt-12 p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">⚠️ Before You Begin</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700 dark:text-yellow-400">
          <li>Make sure you have all the required hardware components</li>
          <li>Download Raspberry Pi OS (64-bit) image</li>
          <li>Have a computer with SD card reader available</li>
          <li>Ensure stable internet connection for downloads</li>
        </ul>
      </div>
    </div>
  )
}
