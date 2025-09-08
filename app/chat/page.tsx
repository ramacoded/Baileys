"use client"
import * as React from "react"
import { useChat, type Message } from "ai/react"
import { toast } from "react-hot-toast"
import ChatWindow from "@/components/chat-window"
import AppHeader from "@/components/app-header"
import Composer, { type ActiveFeature } from "@/components/composer"
import SessionDrawer from "@/components/session-drawer"
import { v4 as uuidv4 } from 'uuid'
import { createClient } from "@/lib/supabase/client"

const fileToGenerativePart = async (file: File) => {
const base64 = await new Promise((resolve, reject) => {
const reader = new FileReader()
reader.readAsDataURL(file)
reader.onload = () => resolve(reader.result)
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
const [activeFeature, setActiveFeature] = React.useState('none')
const [sessionId, setSessionId] = React.useState(null)
const [uploadedFiles, setUploadedFiles] = React.useState([])
const supabase = createClient()
const [previewHtml, setPreviewHtml] = React.useState(null)

const handleFinish = async (assistantMessage) => {
if (activeFeature === 'canvas') {
const title = prompt("Beri judul untuk Canvas ini:")
if (!title) {
toast.error("Judul diperlukan. Canvas tidak disimpan.")
setMessages(prev => prev.slice(0, prev.length - 1))
return
}
const response = await fetch('/api/artifacts', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ htmlContent: assistantMessage.content, title })
})
const { id, error } = await response.json()
if (error) {
throw new Error(error)
}
const canvasCardMessage = {
id: uuidv4(),
role: 'system',
content: JSON.stringify({ type: 'canvas-card', artifactId: id, title, htmlContent: assistantMessage.content })
}
setMessages(prev => [...prev.slice(0, prev.length - 1), canvasCardMessage])
await saveMessageToDb(sessionId, 'assistant', canvasCardMessage.content)
} else {
await saveMessageToDb(sessionId, 'assistant', assistantMessage.content)
}
}

const handleNewSession = async () => {
setMessages([])
setSessionId(null)
setUploadedFiles([])
}

const saveMessageToDb = async (sessionId, role, content) => {
try {
await fetch('/api/messages', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ session_id: sessionId, role, content })
})
} catch (error) {
console.error("Gagal menyimpan pesan:", error)
}
}

const { messages, input, handleInputChange, handleSubmit, isLoading, append, setMessages } = useChat({
api: '/api/chat/stream',
body: {
activeFeature
},
onFinish: handleFinish,
onError: (error) => {
toast.error(error.message)
},
})

const handleCustomSubmit = async (e) => {
e.preventDefault()
const currentInput = input
if (!currentInput && uploadedFiles.length === 0) return
let newSessionId = sessionId
if (!newSessionId) {
const response = await fetch('/api/sessions', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ title: currentInput.substring(0, 30) || "Percakapan baru" })
})
const data = await response.json()
newSessionId = data.id
setSessionId(newSessionId)
}
setUploadedFiles([])
const textPart = currentInput ? [{ text: currentInput }] : []
const fileParts = await Promise.all(
uploadedFiles.map(fileToGenerativePart)
)
const userMessageContent = [...fileParts, ...textPart]
const userMessage = {
id: uuidv4(),
role: 'user',
content: userMessageContent
}
append(userMessage)
await saveMessageToDb(newSessionId, 'user', JSON.stringify(userMessageContent))
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