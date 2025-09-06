'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PlusCircle, Search } from 'lucide-react'
export default function SessionDrawer() {
return (
<div className="flex flex-col h-full bg-background p-4">
<div className="flex items-center justify-between pb-4 border-b">
<h2 className="text-xl font-semibold">Percakapan</h2>
<Button variant="ghost" size="icon">
<PlusCircle className="w-5 h-5" />
</Button>
</div>
<div className="relative mt-4">
<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
<Input placeholder="Telusuri sesi..." className="pl-8" />
</div>
<div className="flex-1 mt-4 overflow-y-auto">
<p className="text-sm text-center text-muted-foreground">Belum ada sesi.</p>
</div>
</div>
)
}