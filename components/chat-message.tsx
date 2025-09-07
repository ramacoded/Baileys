'use client'

import { Message } from "ai"
import { Bot, User, LoaderCircle } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CanvasCard } from "./canvas-card"
import { useState, useEffect } from "react"

interface ChatMessageProps {
  message: Message
}

const extractTitle = (html: string): string => {
  const match = html.match(/<title>(.*?)<\/title>/)
  return match ? match[1] : "Untitled"
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [artifact, setArtifact] = useState<{ id: string; title: string; html: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessed, setIsProcessed] = useState(false)

  const isHtmlResponse = message.role === 'assistant' && /<!DOCTYPE html>/i.test(message.content)

  useEffect(() => {
    if (isHtmlResponse && !isProcessed && !isLoading) {
      const saveArtifact = async () => {
        setIsLoading(true)
        const title = extractTitle(message.content)
        try {
          const response = await fetch('/api/artifacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ htmlContent: message.content, title: title }),
          })
          if (response.ok) {
            const data = await response.json()
            setArtifact({ id: data.id, title, html: message.content })
          }
        } catch (error) {
          console.error("Failed to save artifact", error)
        } finally {
          setIsLoading(false)
          setIsProcessed(true)
        }
      }
      saveArtifact()
    }
  }, [isHtmlResponse, message.content, isProcessed, isLoading])

  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 p-2 rounded-full bg-secondary">
        {message.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>
      <div className="w-full">
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <LoaderCircle className="w-4 h-4 animate-spin" />
            <span>Memproses Canvas...</span>
          </div>
        ) : artifact ? (
          <CanvasCard
            artifactId={artifact.id}
            title={artifact.title}
            htmlContent={artifact.html}
          />
        ) : (
          <div className="prose prose-stone dark:prose-invert max-w-none pt-1">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
              }
