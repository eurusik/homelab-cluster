'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Introduction' },
  { href: '/motivation', label: 'Motivation' },
  { href: '/hardware', label: 'Hardware' },
  { href: '/networking', label: 'Networking' },
  { href: '/architecture', label: 'K3s Architecture' },
  { 
    label: 'Guides',
    children: [
      { href: '/guides/setup-raspberry-pi', label: 'Setup Raspberry Pis' },
      { href: '/guides/install-k3s', label: 'Install K3s' },
      { href: '/guides/k3s-ha-ansible', label: 'K3s HA with Ansible' },
    ]
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#111111] border-r border-[#2a2a2a] overflow-y-auto">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-8 text-[#ff8c00] font-mono">@eurusik lab</h1>
        <nav className="space-y-1">
          <div className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-mono">My Homelab</div>
          {navItems.map((item, index) => (
            <div key={index}>
              {item.href ? (
                <Link
                  href={item.href}
                  className={`block px-3 py-1.5 text-sm font-mono transition ${
                    pathname === item.href
                      ? 'text-[#ff8c00]'
                      : 'text-gray-400 hover:text-[#ffa726]'
                  }`}
                >
                  {pathname === item.href && '> '}{item.label}
                </Link>
              ) : (
                <>
                  <div className="px-3 py-2 mt-4 text-xs font-bold text-white uppercase tracking-wider font-mono">
                    {item.label}
                  </div>
                  {item.children && (
                    <div className="space-y-1">
                      {item.children.map((child, childIndex) => (
                        <Link
                          key={childIndex}
                          href={child.href}
                          className={`block px-6 py-1.5 text-sm font-mono transition ${
                            pathname === child.href
                              ? 'text-[#ff8c00]'
                              : 'text-gray-400 hover:text-[#ffa726]'
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
}
