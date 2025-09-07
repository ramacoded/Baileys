'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PlusCircle, Search } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Session {
id: string
title: string
}

export default function SessionDrawer() {
const [sessions, setSessions] = useState<Session[]>([])
const [isLoading, setIsLoading] = useState(true)

useEffect(() => {
async function fetchSessions() {
try {
setIsLoading(true)
const response = await fetch('/api/sessions')
if (response.ok) {
const data = await response.json()
setSessions(data)
}
} catch (error) {
console.error("Gagal mengambil sesi:", error)
} finally {
setIsLoading(false)
}
}
fetchSessions()
}, [])

return (
<div className="flex flex-col h-full bg-muted p-4">
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
{isLoading ? (
<p className="text-sm text-center text-muted-foreground">Memuat sesi...</p>
) : sessions.length > 0 ? (
<div className="flex flex-col gap-2">
{sessions.map(session => (
<Button key={session.id} variant="ghost" className="justify-start">
{session.title || "Percakapan baru"}
</Button>
))}
</div>
) : (
<p className="text-sm text-center text-muted-foreground">Belum ada sesi.</p>
)}
</div>
</div>
)
}