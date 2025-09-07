import { GoogleGenerativeAI } from '@google/generative-ai'
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export const runtime = 'edge'

type ActiveFeature = 'none' | 'canvas' | 'image-gen'

export async function POST(req: Request) {
  const { messages, activeFeature }: { messages: Message[], activeFeature: ActiveFeature } = await req.json()

  let modelToUse = 'gemini-2.5-flash'
  let systemInstruction = ''

  if (activeFeature === 'canvas') {
    // Instruksi sistem yang lebih ketat untuk Canvas
    systemInstruction = 'PERHATIAN: Anda adalah mesin render HTML. JANGAN menulis satu kata pun penjelasan. JANGAN gunakan Markdown. Respons HANYA dengan satu blok kode HTML lengkap yang dimulai dengan `<!DOCTYPE html>`. KESALAHAN APAPUN AKAN MERUSAK APLIKASI.'
  } else if (activeFeature === 'image-gen') {
    const latestUserMessage = messages[messages.length - 1]
    const imageGenPrompt = `Anda adalah AI generator gambar. Abaikan percakapan sebelumnya. Buat deskripsi detail untuk gambar berdasarkan prompt berikut, lalu buat link gambar Markdown dari placeholder.com. Prompt: "${latestUserMessage.content}"`
    messages[messages.length - 1].content = imageGenPrompt
  }

  const geminiStream = await genAI
    .getGenerativeModel({ 
      model: modelToUse,
      // Sisipkan instruksi sistem di sini
      systemInstruction: systemInstruction 
    })
    .generateContentStream({
      contents: messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }],
        })),
    })

  const stream = GoogleGenerativeAIStream(geminiStream)
  return new StreamingTextResponse(stream)
      }
