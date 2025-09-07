'use client'

import { Message } from 'ai'
import { ChatMessage } from './chat-message'

interface ChatWindowProps {
  messages: Message[]
  onPreview: (htmlContent: string) => void
}

export default function ChatWindow({ messages, onPreview }: ChatWindowProps) {
  const showWelcome = messages.length === 0

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {showWelcome && (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-180px)]">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-muted-foreground/80">
              Halo, ada yang bisa dibantu?
            </h1>
          </div>
        )}
        <div className="flex flex-col gap-6">
          {messages.map(m => (
            <ChatMessage key={m.id} message={m} onPreview={onPreview} />
          ))}
        </div>
      </div>
    </main>
  )
}
