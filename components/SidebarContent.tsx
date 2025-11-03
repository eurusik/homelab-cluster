import Link from 'next/link'

interface NavItem {
  href?: string
  label: string
  children?: { href: string; label: string }[]
}

interface SidebarContentProps {
  navItems: NavItem[]
  pathname: string
  onLinkClick?: () => void
}

export default function SidebarContent({ navItems, pathname, onLinkClick }: SidebarContentProps) {
  return (
    <div className="p-6 pb-8">
      <h1 className="text-2xl font-bold mb-8 text-[#ff8c00] font-mono">K3s Homelab</h1>
      <nav className="space-y-1">
        <div className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-mono">My Homelab</div>
        {navItems.map((item, index) => (
          <div key={index}>
            {item.href ? (
              <Link
                href={item.href}
                onClick={onLinkClick}
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
                        onClick={onLinkClick}
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
  )
}
