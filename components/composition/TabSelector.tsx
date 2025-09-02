'use client'

import { useState } from 'react'

interface TabSelectorProps {
  onTabChange: (tab: 'profile' | 'detail') => void
  hasProfile: boolean
  hasDetail: boolean
  className?: string
}

export function TabSelector({ onTabChange, hasProfile, hasDetail, className = '' }: TabSelectorProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'detail'>('profile')

  const handleTabClick = (tab: 'profile' | 'detail') => {
    setActiveTab(tab)
    onTabChange(tab)
  }

  // If neither profile nor detail exists, don't render anything
  if (!hasProfile && !hasDetail) {
    return null
  }

  // If only one type exists, don't render tabs
  if (hasProfile && !hasDetail) {
    return null
  }

  if (!hasProfile && hasDetail) {
    return null
  }

  return (
    <div className={`inline-flex space-x-1 ${className}`}>
      <button
        onClick={() => handleTabClick('profile')}
        className={`
          px-3 py-1 text-sm font-ui font-medium transition-all duration-200
          ${activeTab === 'profile' 
            ? 'border-[3px] border-core-dark bg-core-dark text-white' 
            : 'border-[3px] border-core-dark text-core-dark hover:bg-core-dark hover:text-white'
          }
        `}
      >
        Profile
      </button>
      <button
        onClick={() => handleTabClick('detail')}
        className={`
          px-3 py-1 text-sm font-ui font-medium transition-all duration-200
          ${activeTab === 'detail' 
            ? 'border-[3px] border-core-dark bg-core-dark text-white' 
            : 'border-[3px] border-core-dark text-core-dark hover:bg-core-dark hover:text-white'
          }
        `}
      >
        Detail
      </button>
    </div>
  )
}
