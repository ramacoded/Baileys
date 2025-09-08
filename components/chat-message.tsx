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
const parsedContent = JSON.parse(message.content as string)
if (parsedContent.type === 'canvas-card') {
return <CanvasCard {...parsedContent} />
}
} catch (e) {
// Abaikan jika bukan JSON
}
return null
}

// Ekstrak konten teks, baik itu string maupun bagian dari array
let textContent = ''
if (typeof message.content === 'string') {
textContent = message.content
} else if (Array.isArray(message.content)) {
const textPart = message.content.find(part => 'text' in part)
textContent = textPart ? textPart.text : ''
}

if (message.role === 'assistant' && textContent.trim().startsWith('<!DOCTYPE html>')) {
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
"flex space-x-2 max-w-full",
message.role === "user"
? "bg-secondary text-secondary-foreground rounded-lg px-3 py-2"
: ""
)}
>
{message.role === 'assistant' ? (
<article className="prose prose-stone dark:prose-invert max-w-none">
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
{textContent}
</ReactMarkdown>
</article>
) : (
<span className="break-words whitespace-pre-wrap">{textContent}</span>
)}
</div>
</div>
)
}