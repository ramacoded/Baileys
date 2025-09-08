'use client'

import { Message } from 'ai'
import { ChatMessage } from './chat-message'
import { TypeAnimation } from 'react-type-animation'
import { TypingIndicator } from './typing-indicator'

interface ChatWindowProps {
messages: Message[]
isLoading: boolean
onPreview: (htmlContent: string) => void
}

export default function ChatWindow({ messages, isLoading, onPreview }: ChatWindowProps) {
const showWelcome = messages.length === 0

return (
<main className="flex-1 overflow-y-auto">
<div className="max-w-3xl mx-auto px-4 py-6">
{showWelcome && (
<div className="flex flex-col items-center justify-center h-[calc(100vh-180px)]">
<TypeAnimation
sequence={[
'Halo, ada yang bisa dibantu?',
7000,
'',
2000
]}
wrapper="h1"
cursor={true}
repeat={Infinity}
className="text-3xl md:text-4xl font-bold text-center text-muted-foreground"
/>
</div>
)}
<div className="flex flex-col gap-6">
{messages.map(m => (
<ChatMessage key={m.id} message={m} onPreview={onPreview} />
))}
{isLoading && <TypingIndicator />}
</div>
</div>
</main>
)
}