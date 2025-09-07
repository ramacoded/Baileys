import { Message } from "ai"
import { cn } from "@/lib/utils"
import { CanvasCard } from './canvas-card'

export interface ChatMessageProps {
  message: Message
  onPreview: (htmlContent: string) => void
}

export function ChatMessage({ message, ...props }: ChatMessageProps) {
  let isCanvasCard = false
  let cardProps = null

  // Coba parse konten pesan. Jika berhasil dan tipenya canvas-card, render kartu.
  try {
    const parsedContent = JSON.parse(message.content)
    if (message.role === 'system' && parsedContent.type === 'canvas-card') {
      isCanvasCard = true
      cardProps = parsedContent
    }
  } catch (e) {
    // Bukan JSON, biarkan sebagai pesan biasa
  }

  if (isCanvasCard && cardProps) {
    return <CanvasCard {...cardProps} />
  }
  
  // Jangan render pesan sistem yang bukan kartu
  if (message.role === 'system') {
    return null
  }

  return (
    <div
      className={cn(
        "group relative mb-4 flex items-start",
        message.role === "user" ? "justify-end" : "justify-start"
      )}
      {...props}
    >
      <div
        className={cn(
          "flex space-x-2 rounded-lg px-3 py-2 text-base",
          message.role === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        <span className="break-words">{message.content}</span>
      </div>
    </div>
  )
}
