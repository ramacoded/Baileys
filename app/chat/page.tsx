"use client"
import * as React from "react"
import { useChat } from "ai/react"
import { toast } from "react-hot-toast"
import ChatWindow from "@/components/chat-window"
import AppHeader from "@/components/app-header"
import Composer, { type ActiveFeature } from "@/components/composer"
import SessionDrawer from "@/components/session-drawer"

export default function ChatPage() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
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
          
          if (!response.ok) throw new Error('Gagal menyimpan artifact')

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
          console.error(error)
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
    setActiveFeature(prev => prev === feature ? 'none' : feature)
  }

  return (
    <div className="flex h-screen bg-background">
      <div className={`transition-all duration-300 bg-muted/50 overflow-hidden ${isDrawerOpen ? 'w-72' : 'w-0'}`}>
        <SessionDrawer />
      </div>
      <div className="flex flex-col flex-1 border-l">
        <AppHeader onMenuClick={() => setIsDrawerOpen(!isDrawerOpen)} />
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
    </div>
  )
        }
