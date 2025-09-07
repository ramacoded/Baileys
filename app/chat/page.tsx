'use client'

import { useChat } from 'ai/react'
import { useState } from 'react'
import AppHeader from '@/components/app-header'
import ChatWindow from '@/components/chat-window'
import Composer from '@/components/composer'
import { CanvasPanel } from '@/components/canvas-panel'

// Definisi untuk tipe fitur aktif
type ActiveFeature = 'none' | 'canvas' | 'image-gen'

export default function ChatPage() {
  const [canvasContent, setCanvasContent] = useState<string | null>(null)
  const [activeFeature, setActiveFeature] = useState<ActiveFeature>('none')
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    api: '/api/chat/stream',
    // Kirim 'activeFeature' di dalam body request
    body: {
      activeFeature,
    },
  })

  const handlePreview = (htmlContent: string) => {
    setCanvasContent(htmlContent)
  }

  const handleCloseCanvas = () => {
    setCanvasContent(null)
    if (activeFeature === 'canvas') {
      setActiveFeature('none')
    }
  }

  const handleFeatureSelect = (feature: ActiveFeature) => {
    if (activeFeature === feature) {
      setActiveFeature('none')
      setInput('') 
    } else {
      setActiveFeature(feature)
      if (feature === 'canvas') {
        setInput('Buatkan sebuah tombol dengan efek hover') 
      } else if (feature === 'image-gen') {
        setInput('Seekor kucing memakai kacamata hitam di luar angkasa')
      }
    }
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
      <CanvasPanel htmlContent={canvasContent} onOpenChange={handleCloseCanvas} />
    </div>
  )
        }
