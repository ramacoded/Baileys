'use client'

import { useChat } from 'ai/react'
import { useState } from 'react'
import AppHeader from '@/components/app-header'
import ChatWindow from '@/components/chat-window'
import Composer from '@/components/composer'

type ActiveFeature = 'none' | 'canvas' | 'image-gen'

export default function ChatPage() {
  const [activeFeature, setActiveFeature] = useState<ActiveFeature>('none')
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    api: '/api/chat/stream',
    body: { activeFeature },
  })

  const handleFeatureSelect = (feature: ActiveFeature) => {
    if (activeFeature === feature) {
      setActiveFeature('none')
      setInput('') 
    } else {
      setActiveFeature(feature)
      if (feature === 'canvas') {
        setInput('Buatkan halaman portofolio sederhana') 
      } else if (feature === 'image-gen') {
        setInput('Seekor astronot menunggangi kuda')
      }
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <AppHeader />
      <ChatWindow messages={messages} />
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
