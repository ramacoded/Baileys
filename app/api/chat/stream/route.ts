import genAI from '@/lib/gemini'
import { GoogleGenerativeAIStream, StreamingTextResponse } from 'ai'

export const runtime = 'edge'

export async function POST(req: Request) {
const { messages } = await req.json()

const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

const stream = await model.generateContentStream({
contents: messages.map((m: any) => ({
role: m.role === 'user' ? 'user' : 'model',
parts: [{ text: m.content }],
})),
})

const vercelStream = GoogleGenerativeAIStream(stream)

return new StreamingTextResponse(vercelStream)
}
