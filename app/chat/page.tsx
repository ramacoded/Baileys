'use client'

import { useChat } from 'ai/react'
import { useState } from 'react'
import AppHeader from '@/components/app-header'
import ChatWindow from '@/components/chat-window'
import Composer from '@/components/composer'
import { CanvasPanel } from '@/components/canvas-panel'
import { Image as ImageIcon, Code } from 'lucide-react'

// Definisi untuk tipe fitur aktif
type ActiveFeature = 'none' | 'canvas' | 'image-gen'

export default function ChatPage() {
  const [canvasContent, setCanvasContent] = useState<string | null>(null)
  const [activeFeature, setActiveFeature] = useState<ActiveFeature>('none') // State fitur aktif
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    api: '/api/chat/stream',
  })

  const handlePreview = (htmlContent: string) => {
    setCanvasContent(htmlContent)
  }

  const handleCloseCanvas = () => {
    setCanvasContent(null)
    setActiveFeature('none') // Reset fitur aktif saat canvas ditutup
  }

  // Fungsi yang dipanggil saat fitur dari dropdown dipilih
  const handleFeatureSelect = (feature: ActiveFeature) => {
    if (activeFeature === feature) {
      setActiveFeature('none') // Toggle off jika sudah aktif
      setInput('') // Bersihkan input jika fitur dinonaktifkan
    } else {
      setActiveFeature(feature)
      // Tambahkan instruksi awal ke input jika diperlukan
      if (feature === 'canvas') {
        setInput('Buatkan kode HTML untuk...') 
      } else if (feature === 'image-gen') {
        setInput('Buatkan gambar dengan prompt: ')
      }
    }
  }

  // Modifikasi handleSubmit untuk menyertakan konteks fitur
  const customHandleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    let currentInput = input

    if (activeFeature === 'canvas' && !input.startsWith('Buatkan kode HTML')) {
      // Jika Canvas aktif dan user tidak memulai dengan prompt khusus, tambahkan prompt otomatis
      currentInput = `Buatkan kode HTML untuk: ${input}`
    } else if (activeFeature === 'image-gen' && !input.startsWith('Buatkan gambar')) {
      currentInput = `Buatkan gambar dengan prompt: ${input}`
    }

    // Set input sementara untuk dikirim, lalu reset kembali input asli setelah submit
    const originalInput = input;
    setInput(currentInput); 
    
    // Panggil handleSubmit dari useChat
    handleSubmit(e); 

    // Reset input ke input asli jika tidak ingin prompt otomatis terkirim permanen
    // Atau jika ingin prompt otomatis tetap ada di input, hapus baris ini
    setInput(originalInput); 
  }


  return (
    <div className="flex flex-col h-screen">
      <AppHeader />
      <ChatWindow messages={messages} onPreview={handlePreview} />
      <Composer
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={customHandleSubmit} // Gunakan custom handleSubmit
        isLoading={isLoading}
        activeFeature={activeFeature} // Teruskan state fitur aktif
        onFeatureSelect={handleFeatureSelect} // Teruskan fungsi handleFeatureSelect
      />
      <CanvasPanel htmlContent={canvasContent} onOpenChange={handleCloseCanvas} />
    </div>
  )
}
