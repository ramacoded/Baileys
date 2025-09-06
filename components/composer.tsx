import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Paperclip, SendHorizontal, MoreHorizontal, LoaderCircle } from 'lucide-react'
import React from 'react'

interface ComposerProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
}

export default function Composer({ input, handleInputChange, handleSubmit, isLoading }: ComposerProps) {
  return (
    <footer className="bg-background/95 backdrop-blur-sm border-t">
      <div className="max-w-3xl mx-auto px-4 py-3">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <Button type="button" variant="ghost" size="icon" className="absolute left-2" disabled={isLoading}>
            <Paperclip className="w-5 h-5 text-muted-foreground" />
          </Button>
          <Textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Ketik pesan atau unggah file..."
            className="w-full rounded-2xl p-3 pl-12 pr-24 resize-none border-border/40 shadow-sm"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e as any)
              }
            }}
            disabled={isLoading}
          />
          <div className="absolute right-2 flex items-center gap-1">
            <Button type="button" variant="ghost" size="icon" disabled={isLoading}>
              <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
            </Button>
            <Button type="submit" size="icon" className="rounded-full w-8 h-8" disabled={isLoading || !input}>
              {isLoading ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <SendHorizontal className="w-4 h-4" />}
            </Button>
          </div>
        </form>
      </div>
    </footer>
  )
}