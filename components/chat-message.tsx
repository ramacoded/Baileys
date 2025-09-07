'use client'

import { Message } from "ai"
import { Bot, User, Code } from "lucide-react"
import { Button } from "./ui/button"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ChatMessageProps {
  message: Message
  onPreview: (htmlContent: string) => void
}

export function ChatMessage({ message, onPreview }: ChatMessageProps) {
  const isHtml = message.role === 'assistant' && message.content.trim().startsWith('<!DOCTYPE html>')
  
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 p-2 rounded-full bg-secondary">
        {message.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>
      <div className="prose prose-stone dark:prose-invert max-w-none pt-1 w-full">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {message.content}
        </ReactMarkdown>
        {isHtml && (
          <div className="mt-4 p-2 border rounded-lg">
            <p className="text-sm font-semibold mb-2">Live Preview Ready</p>
            <Button onClick={() => onPreview(message.content)}>
              <Code className="w-4 h-4 mr-2" />
              Preview in Canvas
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
