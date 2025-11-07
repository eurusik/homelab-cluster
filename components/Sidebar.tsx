'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import SidebarContent from './SidebarContent'

const navItems = [
  { href: '/', label: 'Introduction' },
  { href: '/motivation', label: 'Motivation' },
  { href: '/hardware', label: 'Hardware' },
  { href: '/networking', label: 'Networking' },
  { href: '/architecture', label: 'K3s Architecture' },
  { href: '/status', label: 'Uptime' },
  { href: '/cluster', label: 'Cluster Metrics' },
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
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#111111] border border-[#2a2a2a] rounded-lg"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6 text-[#ff8c00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Single instance for both mobile and desktop */}
      <aside className={`
        fixed left-0 top-0 h-screen w-64 bg-[#111111] border-r border-[#2a2a2a] overflow-y-auto z-40 transition-transform duration-300
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <SidebarContent 
          navItems={navItems} 
          pathname={pathname} 
          onLinkClick={() => setIsOpen(false)} 
        />
      </aside>
    </>
  )
}
