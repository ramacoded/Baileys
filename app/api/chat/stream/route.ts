import { GoogleGenerativeAI } from '@google/generative-ai'
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export const runtime = 'edge'

type ActiveFeature = 'none' | 'canvas' | 'image-gen'

// Fungsi untuk mengubah pesan dari format Vercel AI SDK ke format Google
const toGoogleGenerativeAIMessage = (message: Message) => {
if (typeof message.content === 'string') {
return {
role: message.role === 'user' ? 'user' : 'model',
parts: [{ text: message.content }],
}
}

// Menangani konten multimodal
const parts = message.content.map((part) => {
if ('text' in part) {
return { text: part.text }
}
return {
inlineData: {
mimeType: part.inlineData.mimeType,
data: part.inlineData.data,
},
}
})

return {
role: message.role === 'user' ? 'user' : 'model',
parts: parts,
}
}

export async function POST(req: Request) {
const { messages, activeFeature }: { messages: Message[], activeFeature: ActiveFeature } = await req.json()

let modelToUse = 'gemini-pro-vision' // Ganti ke model yang mendukung visi
let systemInstruction = ''

if (activeFeature === 'canvas') {
modelToUse = 'gemini-2.5-flash'
systemInstruction = 'PERHATIAN: Anda adalah mesin render HTML. JANGAN menulis satu kata pun penjelasan. JANGAN gunakan Markdown. Respons HANYA dengan satu blok kode HTML lengkap yang dimulai dengan `<!DOCTYPE html>`. KESALAHAN APAPUN AKAN MERUSAK APLIKASI.'
} else if (activeFeature === 'image-gen') {
const latestUserMessage = messages[messages.length - 1]
const imageGenPrompt = `Anda adalah AI generator gambar. Abaikan percakapan sebelumnya. Buat deskripsi detail untuk gambar berdasarkan prompt berikut, lalu buat link gambar Markdown dari placeholder.com. Prompt: "${latestUserMessage.content}"`
messages[messages.length - 1].content = imageGenPrompt
}

const geminiStream = await genAI
.getGenerativeModel({
model: modelToUse,
systemInstruction: systemInstruction
})
.generateContentStream({
contents: messages
.filter(m => m.role !== 'system')
.map(toGoogleGenerativeAIMessage)
})

const stream = GoogleGenerativeAIStream(geminiStream)
return new StreamingTextResponse(stream)
}