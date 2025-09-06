'use client'

import { useChat } from 'ai/react'
import AppHeader from '@/components/app-header'
import ChatWindow from '@/components/chat-window'
import Composer from '@/components/composer'

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat/stream',
  })

  return (
    <div className="flex flex-col h-screen">
      <AppHeader />
      <ChatWindow messages={messages} />
      <Composer
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  )
}