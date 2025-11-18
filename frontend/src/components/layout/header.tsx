'use client'

import { useState } from 'react'
import { ChevronDown, LogOut, User } from 'lucide-react'

export function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-8">
      {/* Tenant Selector */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          <span>My Workspace</span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </button>

        {/* Dropdown - placeholder */}
        {isDropdownOpen && (
          <div className="absolute left-0 top-full mt-1 w-64 rounded-lg border bg-white shadow-lg">
            <div className="p-2">
              <div className="rounded-md px-3 py-2 text-sm hover:bg-gray-100">
                My Workspace
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Menu */}
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-100">
          <User className="h-5 w-5 text-gray-600" />
          <span className="text-gray-700">admin@example.com</span>
        </button>

        <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}
