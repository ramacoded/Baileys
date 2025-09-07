import { Message } from "ai"
import { cn } from "@/lib/utils"
import { CanvasCard } from './canvas-card'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CodeBlock from './code-block'

export interface ChatMessageProps {
message: Message
onPreview: (htmlContent: string) => void
}

export function ChatMessage({ message, ...props }: ChatMessageProps) {
if (message.role === 'system') {
try {
const parsedContent = JSON.parse(message.content)
if (parsedContent.type === 'canvas-card') {
return <CanvasCard {...parsedContent} />
}
} catch (e) {
// Abaikan jika bukan JSON
}
return null
}

if (message.role === 'assistant' && message.content.trim().startsWith('<!DOCTYPE html>')) {
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
"flex space-x-2 rounded-lg px-3 py-2 max-w-full overflow-x-auto",
message.role === "user"
? "bg-primary text-primary-foreground"
: "bg-muted"
)}
>
{message.role === 'assistant' ? (
<div className="prose prose-stone dark:prose-invert prose-p:before:content-none prose-p:after:content-none">
<ReactMarkdown
remarkPlugins={[remarkGfm]}
components={{
code({ node, className, children, ...props }) {
const match = /language-(\w+)/.exec(className || '')
const lang = match?.[1]
if (lang) {
return (
<CodeBlock
language={lang}
value={String(children).replace(/\n$/, '')}
/>
)
}
return <code className={className} {...props}>{children}</code>
},
}}
>
{message.content}
</ReactMarkdown>
</div>
) : (
<span className="break-words whitespace-pre-wrap">{message.content}</span>
)}
</div>
</div>
)
}