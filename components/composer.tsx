'use client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Paperclip, SendHorizontal, MoreHorizontal } from 'lucide-react'

export default function Composer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 py-3">
        <div className="relative flex items-center">
          <Button variant="ghost" size="icon" className="absolute left-2">
            <Paperclip className="w-5 h-5 text-muted-foreground" />
          </Button>
          <Textarea
            placeholder="Ketik pesan atau unggah file..."
            className="w-full rounded-2xl p-3 pl-12 pr-24 resize-none border-border/40 shadow-sm"
            rows={1}
          />
          <div className="absolute right-2 flex items-center gap-1">
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
            </Button>
            <Button size="icon" className="rounded-full w-8 h-8">
              <SendHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}