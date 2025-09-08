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

const { messages, input, handleInputChange, handleSubmit, isLoading, append, setMessages } = useChat({
api: '/api/chat/stream',
body: {
activeFeature
},
async onFinish(assistantMessage) {
// Logic onFinish yang sudah ada sebelumnya
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
setUploadedFiles([])
const textPart = currentInput ? [{ text: currentInput }] : []
const fileParts = await Promise.all(
uploadedFiles.map(fileToGenerativePart)
)

append({
id: uuidv4(),
role: 'user',
content: [...fileParts, ...textPart],
} as any)
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
className="absolute inset-0 bg-black/50 z-40 md:hidden"
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