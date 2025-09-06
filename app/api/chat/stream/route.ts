import genAI from '@/lib/gemini'
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai'
export const runtime = 'edge'
const buildPrompt = (messages: Message[]) => {
return {
contents: messages
.filter(m => m.role === 'user' || m.role === 'assistant')
.map(m => ({
role: m.role === 'user' ? 'user' : 'model',
parts: [{ text: m.content }],
})),
}
}
export async function POST(req: Request) {
const { messages } = await req.json()
const geminiStream = await genAI
.getGenerativeModel({ model: 'gemini-2.5-flash' })
.generateContentStream(buildPrompt(messages))
const stream = GoogleGenerativeAIStream(geminiStream)
return new StreamingTextResponse(stream)
}