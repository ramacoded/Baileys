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

  try {
    const parsedContent = JSON.parse(message.content)
    if (message.role === 'system' && parsedContent.type === 'canvas-card') {
      isCanvasCard = true
      cardProps = parsedContent
    }
  } catch (e) {
    // Abaikan jika bukan JSON
  }

  if (isCanvasCard && cardProps) {
    return <CanvasCard {...cardProps} />
  }
  
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
          "flex space-x-2 rounded-lg px-3 py-2",
          message.role === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        <span className="break-words whitespace-pre-wrap">{message.content}</span>
      </div>
    </div>
  )
          }
