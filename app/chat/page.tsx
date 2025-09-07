"use client"
import * as React from "react"
import { useChat } from "ai/react"
import { toast } from "react-hot-toast"
import ChatWindow from "@/components/chat-window"
import AppHeader from "@/components/app-header"
import Composer, { type ActiveFeature } from "@/components/composer"
import SessionDrawer from "@/components/session-drawer"

export default function ChatPage() {
const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
const [activeFeature, setActiveFeature] = React.useState<ActiveFeature>('none')
const [sessionId, setSessionId] = React.useState<string | null>(null)
const lastUserMessage = React.useRef<string | null>(null)

const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
api: '/api/chat/stream',
body: {
activeFeature
},
async onFinish(assistantMessage) {
let currentSessionId = sessionId
const userMessageContent = lastUserMessage.current

try {
if (!currentSessionId && userMessageContent) {
const sessionResponse = await fetch('/api/sessions', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ title: userMessageContent.substring(0, 50) })
})
if (!sessionResponse.ok) throw new Error('Gagal membuat sesi baru')
const sessionData = await sessionResponse.json()
currentSessionId = sessionData.id
setSessionId(currentSessionId)
}

if (currentSessionId && userMessageContent) {
await Promise.all([
fetch('/api/messages', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
content: userMessageContent,
role: 'user',
session_id: currentSessionId
})
}),
fetch('/api/messages', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
content: assistantMessage.content,
role: 'assistant',
session_id: currentSessionId
})
})
])
}
} catch (error) {
console.error("Gagal menyimpan percakapan:", error)
toast.error(error instanceof Error ? error.message : "Gagal menyimpan percakapan")
}

if (activeFeature === 'canvas') {
toast.loading('Menerima hasil canvas, menyimpan...')
try {
const response = await fetch('/api/artifacts', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
htmlContent: assistantMessage.content,
title: userMessageContent || "Hasil Canvas Otomatis"
})
})

toast.dismiss()
if (!response.ok) {
toast.error('Gagal menyimpan ke server.')
throw new Error(`Server error: ${response.statusText}`)
}

const data = await response.json()

if (data.id) {
toast.success('Canvas berhasil disimpan.')
const artifactMessage = {
role: 'system' as const,
content: JSON.stringify({
type: 'canvas-card',
artifactId: data.id,
title: userMessageContent || "Hasil Canvas Otomatis",
htmlContent: assistantMessage.content
})
}
append(artifactMessage)
} else {
toast.error('Server tidak mengembalikan ID artifact.')
}
} catch (error) {
toast.dismiss()
toast.error('Terjadi kesalahan saat menyimpan canvas.')
console.error(error)
}
}
if (activeFeature !== 'canvas') {
setActiveFeature('none')
}
},
onError: (error) => {
toast.error(error.message)
},
})

const handleSubmitWrapper = (e: React.FormEvent<HTMLFormElement>) => {
lastUserMessage.current = input
handleSubmit(e)
}

const handleFeatureSelect = (feature: ActiveFeature) => {
setActiveFeature(prev => prev === feature ? 'none' : feature)
}

return (
<div className="h-screen w-full relative overflow-hidden bg-background">
<div className={`absolute top-0 left-0 h-full bg-background border-r z-50 w-72 transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
<SessionDrawer />
</div>

{isDrawerOpen && (
<div
onClick={() => setIsDrawerOpen(false)}
className="absolute inset-0 bg-muted z-40 md:hidden"
/>
)}

<div className="flex flex-col h-full">
<AppHeader onMenuClick={() => setIsDrawerOpen(!isDrawerOpen)} />
<ChatWindow messages={messages} onPreview={() => {}} />
<Composer
input={input}
handleInputChange={handleInputChange}
handleSubmit={handleSubmitWrapper}
isLoading={isLoading}
activeFeature={activeFeature}
onFeatureSelect={handleFeatureSelect}
/>
</div>
</div>
)
}