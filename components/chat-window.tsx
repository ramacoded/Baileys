import { Message } from 'ai'
import { Bot, User } from 'lucide-react'

export default function ChatWindow({ messages }: { messages: Message[] }) {
  const showWelcome = messages.length === 0

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {showWelcome && (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-180px)]">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-muted-foreground/80">
              Halo, ada yang bisa dibantu?
            </h1>
          </div>
        )}
        <div className="flex flex-col gap-6">
          {messages.map(m => (
            <div key={m.id} className="flex items-start gap-4">
              <div className="flex-shrink-0 p-2 rounded-full bg-secondary">
                {m.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className="prose prose-stone dark:prose-invert max-w-none pt-1">
                <p>{m.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}