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

// Fungsi untuk mengekstrak blok kode HTML dan judulnya
const extractHtmlBlock = (content: string): { html: string; title: string; preHtml: string; postHtml: string } | null => {
  const htmlRegex = /(<!DOCTYPE html>[\s\S]*<\/html>)/i
  const match = content.match(htmlRegex)

  if (match && match[1]) {
    const html = match[1]
    const titleMatch = html.match(/<title>(.*?)<\/title>/)
    const title = titleMatch ? titleMatch[1] : "Untitled Canvas"
    
    // Pisahkan konten sebelum dan sesudah blok HTML
    const parts = content.split(html)
    const preHtml = parts[0]
    const postHtml = parts[1]

    return { html, title, preHtml, postHtml }
  }
  return null
}

export function ChatMessage({ message, onPreview }: ChatMessageProps) {
  if (message.role === 'assistant') {
    const extracted = extractHtmlBlock(message.content)
    
    if (extracted) {
      // Jika blok HTML ditemukan, tampilkan dengan format khusus
      return (
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 p-2 rounded-full bg-secondary">
            <Bot className="w-5 h-5" />
          </div>
          <div className="w-full">
            {/* Tampilkan teks APAPUN yang ada SEBELUM blok kode */}
            {extracted.preHtml && (
              <div className="prose prose-stone dark:prose-invert max-w-none pt-1">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{extracted.preHtml}</ReactMarkdown>
              </div>
            )}
            
            {/* Tampilkan KARTU CANVAS */}
            <CanvasCard 
              title={extracted.title}
              onPreview={() => onPreview(extracted.html)}
            />

            {/* Tampilkan teks APAPUN yang ada SETELAH blok kode */}
            {extracted.postHtml && (
              <div className="prose prose-stone dark:prose-invert max-w-none pt-1">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{extracted.postHtml}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      )
    }
  }

  // Jika tidak ada HTML, tampilkan pesan seperti biasa
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
