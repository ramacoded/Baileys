"use client"
import * as React from "react"
import { useChat, type Message } from "ai/react"
import { toast } from "react-hot-toast"
import ChatWindow from "@/components/chat-window"
import AppHeader from "@/components/app-header"
import Composer from "@/components/composer"
export default function ChatPage() {
const [activeFeature, setActiveFeature] = React.useState<string | null>(null)
const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
onFinish: (message) => {
setActiveFeature(null)
console.log("Finished!", message)
},
onError: (error) => {
toast.error(error.message)
},
})
const handlePreview = (url: string) => {
console.log("Previewing URL:", url)
}
const handleFeatureSelect = (feature: string | null) => {
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
