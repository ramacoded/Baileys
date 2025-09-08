"use client"
import * as React from "react"
import { useChat, type Message } from "ai/react"
import { toast } from "react-hot-toast"
import ChatWindow from "@/components/chat-window"
import AppHeader from "@/components/app-header"
import Composer, { type ActiveFeature } from "@/components/composer"
import SessionDrawer from "@/components/session-drawer"
import { v4 as uuidv4 } from 'uuid'

const fileToGenerativePart = async (file: File) => {
const base64 = await new Promise<string>((resolve, reject) => {
const reader = new FileReader()
reader.readAsDataURL(file)
reader.onload = () => resolve(reader.result as string)
reader.onerror = (error) => reject(error)
})
return {
inlineData: {
data: base64.split(',')[1],
mimeType: file.type,
},
}
}

export default function ChatPage() {
const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
const [activeFeature, setActiveFeature] = React.useState<ActiveFeature>('none')
const [sessionId, setSessionId] = React.useState<string | null>(null)
const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([])

const { messages, input, handleInputChange, isLoading, append, setMessages } = useChat({
api: '/api/chat/stream',
body: {
activeFeature
},
async onFinish(assistantMessage) {
let currentSessionId = sessionId
const lastUserMessage = messages.findLast(m => m.role === 'user')

try {
if (!currentSessionId && lastUserMessage) {
const userContentForTitle = Array.isArray(lastUserMessage.content)
? lastUserMessage.content.find(part => 'text' in part)?.text || "New Chat"
: lastUserMessage.content
const sessionResponse = await fetch('/api/sessions', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ title: userContentForTitle.substring(0, 50) })
})
if (!sessionResponse.ok) throw new Error('Gagal membuat sesi baru')
const sessionData = await sessionResponse.json()
currentSessionId = sessionData.id
setSessionId(currentSessionId)
}

if (currentSessionId && lastUserMessage) {
const userContentForDb = Array.isArray(lastUserMessage.content)
? lastUserMessage.content.find(part => 'text' in part)?.text || ""
: lastUserMessage.content

await Promise.all([
fetch('/api/messages', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
content: userContentForDb,
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
toast.error(error instanceof Error ? error.message : "Gagal menyimpan percakapan")
}
},
onError: (error) => {
toast.error(error.message)
},
})

const handleNewSession = () => {
setMessages([])
setSessionId(null)
setUploadedFiles([])
}

const handleCustomSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
e.preventDefault()
const currentInput = input
if (!currentInput && uploadedFiles.length === 0) return

try {
const textPart = currentInput ? [{ text: currentInput }] : []
const fileParts = await Promise.all(
uploadedFiles.map(fileToGenerativePart)
)

append({
id: uuidv4(),
role: 'user',
content: [...fileParts, ...textPart],
} as any)

setUploadedFiles([])
} catch (error) {
toast.error("Gagal memproses file. Coba lagi.")
console.error(error)
}
}

return (
<div className="h-screen w-full relative overflow-hidden bg-background">
<div className={`absolute top-0 left-0 h-full bg-background border-r z-50 w-72 transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
<SessionDrawer onNewSession={handleNewSession} />
</div>

{isDrawerOpen && (
<div
onClick={() => setIsDrawerOpen(false)}
className="absolute inset-0 bg-background z-40 md:hidden"
/>
)}

<div className="flex flex-col h-full">
<AppHeader onMenuClick={() => setIsDrawerOpen(!isDrawerOpen)} />
<ChatWindow messages={messages} isLoading={isLoading} onPreview={() => {}} />
<Composer
input={input}
handleInputChange={handleInputChange}
handleSubmit={handleCustomSubmit}
isLoading={isLoading}
activeFeature={activeFeature}
onFeatureSelect={(feature) => setActiveFeature(prev => prev === feature ? 'none' : feature)}
uploadedFiles={uploadedFiles}
setUploadedFiles={setUploadedFiles}
/>
</div>
</div>
)
}