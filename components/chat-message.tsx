import { Message } from "ai"
import { cn } from "@/lib/utils"
import { CanvasCard } from './canvas-card'

export interface ChatMessageProps {
message: Message
onPreview: (htmlContent: string) => void
}

export function ChatMessage({ message, onPreview, ...props }: ChatMessageProps) {
let isCanvasCard = false
let cardProps = null

try {
const parsedContent = JSON.parse(message.content)
if (parsedContent.type === 'canvas-card') {
isCanvasCard = true
cardProps = parsedContent
}
} catch (e) {
// Not a JSON object, treat as regular text
}

if (message.role === 'system' && isCanvasCard && cardProps) {
return <CanvasCard {...cardProps} />
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
<span className="break-words">{message.content}</span>
</div>
</div>
)
}
