'use client'

import { useChat } from 'ai/react'
import { useState } from 'react'
import AppHeader from '@/components/app-header'
import ChatWindow from '@/components/chat-window'
import Composer from '@/components/composer'
import { CanvasPanel } from '@/components/canvas-panel'

export default function ChatPage() {
  const [canvasContent, setCanvasContent] = useState<string | null>(null)
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat/stream',
  })

  const handlePreview = (htmlContent: string) => {
    setCanvasContent(htmlContent)
  }

  const handleCloseCanvas = () => {
    setCanvasContent(null)
  }

  return (
    <div className="flex flex-col h-screen">
      <AppHeader />
      <ChatWindow messages={messages} onPreview={handlePreview} />
      <Composer
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
      <CanvasPanel htmlContent={canvasContent} onOpenChange={handleCloseCanvas} />
    </div>
  )
    }
