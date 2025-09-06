'use client'

import dynamic from 'next/dynamic'
import React from 'react'

const ChatClient = dynamic(() => import('@/components/chat-client'), {
  ssr: false,
})

export default function ChatPage() {
  return <ChatClient />
}