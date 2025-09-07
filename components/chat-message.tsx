'use client'

import { Message } from "ai"
import { Bot, User } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CanvasCard } from "./canvas-card"

interface ChatMessageProps {
  message: Message
  onPreview: (htmlContent: string) => void
}

// Fungsi kecil untuk mengambil judul dari tag <title> di HTML
const extractTitle = (html: string): string => {
  const match = html.match(/<title>(.*?)<\/title>/)
  return match ? match[1] : "Untitled"
}

export function ChatMessage({ message, onPreview }: ChatMessageProps) {
  const isHtmlResponse = message.role === 'assistant' && message.content.trim().startsWith('<!DOCTYPE html>')
  
  if (isHtmlResponse) {
    const title = extractTitle(message.content)
    return (
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 p-2 rounded-full bg-secondary">
          <Bot className="w-5 h-5" />
        </div>
        <CanvasCard 
          title={title}
          onPreview={() => onPreview(message.content)}
        />
      </div>
    )
  }

  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 p-2 rounded-full bg-secondary">
        {message.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>
      <div className="prose prose-stone dark:prose-invert max-w-none pt-1 w-full">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  )
  }
