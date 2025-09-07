"use client"
import { useChat, type Message } from "ai/react"
import { toast } from "react-hot-toast"
import ChatWindow from "@/components/chat-window"
import AppHeader from "@/components/app-header"
import Composer from "@/components/composer"
export default function ChatPage() {
const { messages, input, handleInputChange, handleSubmit } = useChat({
onFinish: (message) => {
console.log("Finished!", message)
},
onError: (error) => {
toast.error(error.message)
},
})
const handlePreview = (url: string) => {
console.log("Previewing URL:", url)
}
return (
<div className="flex flex-col h-screen">
<AppHeader />
<ChatWindow messages={messages} onPreview={handlePreview} />
<Composer
input={input}
handleInputChange={handleInputChange}
handleSubmit={handleSubmit}
/>
</div>
)
}
