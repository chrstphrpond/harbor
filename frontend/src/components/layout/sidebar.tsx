'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Upload, Lightbulb, Workflow, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Data Upload', href: '/upload', icon: Upload },
  { name: 'Insights', href: '/insights', icon: Lightbulb },
  { name: 'Automation', href: '/automation', icon: Workflow },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-navy text-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-navy-100/10 px-6">
        <h1 className="text-2xl font-bold">Harbor</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-teal text-white'
                  : 'text-gray-300 hover:bg-navy-100/10 hover:text-white'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-navy-100/10 p-4">
        <p className="text-xs text-gray-400">© 2025 Harbor</p>
      </div>
    </div>
  )
}
