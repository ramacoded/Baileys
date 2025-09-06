'use client'
import AppHeader from '@/components/app-header'
import ChatWindow from '@/components/chat-window'
import Composer from '@/components/composer'
export default function ChatPage() {
return (
<div className="flex flex-col h-screen bg-background">
<AppHeader />
<main className="flex-1 overflow-hidden">
<ChatWindow />
</main>
<Composer />
</div>
)
}