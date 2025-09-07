'use client'

import { Bot, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AppHeaderProps {
  onMenuClick: () => void
}

export default function AppHeader({ onMenuClick }: AppHeaderProps) {
  return (
    <header className="h-16 px-4 border-b flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="md:hidden">
          <Menu className="w-6 h-6" />
        </Button>
        <Bot className="w-6 h-6" />
        <span className="font-semibold">Gemini Chat</span>
      </div>
    </header>
  )
}
