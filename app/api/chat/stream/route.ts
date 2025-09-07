import { GoogleGenerativeAI } from '@google/generative-ai'
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export const runtime = 'edge'

// Tipe untuk fitur aktif yang dikirim dari frontend
type ActiveFeature = 'none' | 'canvas' | 'image-gen'

export async function POST(req: Request) {
  const { messages, activeFeature }: { messages: Message[], activeFeature: ActiveFeature } = await req.json()

  // Ambil pesan terakhir dari user
  const latestUserMessage = messages[messages.length - 1]
  
  // --- Sistem Beralih Berdasarkan Fitur Aktif ---

  if (activeFeature === 'canvas') {
    // 1. INSTRUKSI RAHASIA UNTUK MODE CANVAS
    // Kita sisipkan instruksi ini agar AI fokus menghasilkan HTML
    const canvasPrompt: Message = {
      id: 'canvas-prompt',
      role: 'system',
      content: 'Anda sekarang dalam "Canvas Mode". Prioritas utama Anda adalah menghasilkan satu blok kode HTML yang lengkap, mandiri, dan bisa langsung dirender. Mulai respons HANYA dengan `<!DOCTYPE html>` dan jangan tambahkan penjelasan apa pun di luar blok kode.'
    }
    messages.unshift(canvasPrompt) // Tambahkan di awal array pesan
  
  } else if (activeFeature === 'image-gen') {
    // 2. SIMULASI GENERATE IMAGE
    // Catatan: Model gambar Gemini (Imagen) tidak streaming. Untuk menjaga kesederhanaan,
    // kita akan meminta model teks untuk membuat deskripsi dan URL gambar placeholder.
    const imageGenPrompt = `Anda adalah AI generator gambar. Abaikan percakapan sebelumnya. Buat deskripsi detail untuk gambar berdasarkan prompt berikut, lalu buat link gambar Markdown dari placeholder.com. Prompt: "${latestUserMessage.content}"`
    
    // Ganti pesan terakhir dengan prompt khusus gambar
    messages[messages.length - 1].content = imageGenPrompt
  }

  // --- Logika Streaming Standar (setelah prompt dimodifikasi) ---

  const geminiStream = await genAI
    .getGenerativeModel({ model: 'gemini-1.5-flash' })
    .generateContentStream({
      contents: messages
        .filter(m => m.role !== 'system') // Jangan kirim pesan 'system' ke Gemini
        .map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }],
        })),
    })

  const stream = GoogleGenerativeAIStream(geminiStream)
  return new StreamingTextResponse(stream)
    }
