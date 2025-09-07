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
      if (activeFeature === 'canvas') {
        toast.loading('Menerima hasil canvas, menyimpan...')
        try {
          const response = await fetch('/api/artifacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              htmlContent: message.content,
              title: "Hasil Canvas Otomatis"
            })
          })

          toast.dismiss()
          if (!response.ok) {
            toast.error('Gagal menyimpan ke server.')
            throw new Error(`Server error: ${response.statusText}`)
          }
          
          const data = await response.json()

          if (data.id) {
            toast.success('Canvas berhasil disimpan, menampilkan kartu.')
            const artifactMessage = {
              role: 'system' as const,
              content: JSON.stringify({
                type: 'canvas-card',
                artifactId: data.id,
                title: "Hasil Canvas Otomatis",
                htmlContent: message.content
              })
            }
            append(artifactMessage)
          } else {
            toast.error('Server tidak mengembalikan ID artifact.')
          }
        } catch (error) {
          toast.dismiss()
          toast.error('Terjadi kesalahan saat menyimpan canvas.')
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
    <div className="h-screen w-full relative overflow-hidden bg-background">
      <div className={`absolute top-0 left-0 h-full bg-background border-r z-50 w-72 transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SessionDrawer />
      </div>

      {isDrawerOpen && (
        <div 
          onClick={() => setIsDrawerOpen(false)} 
          className="absolute inset-0 bg-black/60 z-40 md:hidden"
        />
      )}

      <div className="flex flex-col h-full">
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
