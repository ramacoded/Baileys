'use client'
import { Menu, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import SessionDrawer from '@/components/session-drawer'

export default function AppHeader() {
  const sessionTitle = null 
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-4 border-b bg-background/95 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[300px] sm:w-[400px]">
            <SessionDrawer />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6" />
          <span className="font-semibold">Gemini Chat</span>
        </div>
      </div>
    </header>
  )
}