'use client'

import AppHeader from '@/components/app-header'
import ChatWindow from '@/components/chat-window'
import Composer from '@/components/composer'

export default function ChatClient() {
  return (
    <div className="flex flex-col h-full">
      <AppHeader />
      <ChatWindow />
      <Composer />
    </div>
  )
}