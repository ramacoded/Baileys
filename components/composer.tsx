'use client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Paperclip, SendHorizontal, MoreHorizontal } from 'lucide-react'
export default function Composer() {
return (
<div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm">
<div className="max-w-3xl mx-auto p-4">
<div className="relative">
<Textarea
placeholder="Ketik pesan atau unggah file..."
className="w-full rounded-2xl p-4 pr-32 resize-none border-border/40 shadow-sm"
rows={1}
/>
<div className="absolute top-1/2 right-3 transform -translate-y-1/2 flex items-center gap-1">
<Button variant="ghost" size="icon">
<Paperclip className="w-5 h-5 text-muted-foreground" />
</Button>
<Button variant="ghost" size="icon">
<MoreHorizontal className="w-5 h-5 text-muted-foreground" />
</Button>
<Button size="icon" className="rounded-full">
<SendHorizontal className="w-5 h-5" />
</Button>
</div>
</div>
</div>
</div>
)
}