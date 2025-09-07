"use client"
import * as React from "react"
import { useChat, type Message } from "ai/react"
import { toast } from "react-hot-toast"
import ChatWindow from "@/components/chat-window"
import AppHeader from "@/components/app-header"
import Composer, { type ActiveFeature } from "@/components/composer"

export default function ChatPage() {
const [activeFeature, setActiveFeature] = React.useState<ActiveFeature>('none')

const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
api: '/api/chat/stream',
body: {
activeFeature
},
onFinish: async (message) => {
if (activeFeature === 'canvas' && message.content.includes('<!DOCTYPE html>')) {
try {
const response = await fetch('/api/artifacts', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
htmlContent: message.content,
title: "Hasil Canvas"
})
})
const data = await response.json()
if (data.id) {
const artifactMessage = {
role: 'system' as const,
content: JSON.stringify({
type: 'canvas-card',
artifactId: data.id,
title: "Hasil Canvas",
htmlContent: message.content
})
}
append(artifactMessage)
}
} catch (error) {
toast.error('Gagal menyimpan hasil canvas.')
}
}
setActiveFeature('none')
},
onError: (error) => {
toast.error(error.message)
},
})

const handlePreview = (url: string) => {
console.log("Previewing URL:", url)
}

const handleFeatureSelect = (feature: ActiveFeature) => {
setActiveFeature(feature)
}

return (
<div className="flex flex-col h-screen">
<AppHeader />
<ChatWindow messages={messages} onPreview={handlePreview} />
<Composer
input={input}
handleInputChange={handleInputChange}
handleSubmit={handleSubmit}
isLoading={isLoading}
activeFeature={activeFeature}
onFeatureSelect={handleFeatureSelect}
/>
</div>
)
}
