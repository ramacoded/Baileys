'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Laptop, MoreHorizontal, Copy, Code, Download } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

interface CanvasCardProps {
artifactId: string
title: string
htmlContent: string
}

export function CanvasCard({ artifactId, title, htmlContent }: CanvasCardProps) {
const { toast } = useToast()

const handleCopy = () => {
navigator.clipboard.writeText(htmlContent)
toast({ title: "Kode berhasil disalin!" })
}

const handleDownload = () => {
const blob = new Blob([htmlContent], { type: 'text/html' })
const url = URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url
a.download = `${title.replace(/ /g, '_') || 'canvas'}.html`
document.body.appendChild(a)
a.click()
document.body.removeChild(a)
URL.revokeObjectURL(url)
}

return (
<Card className="max-w-md my-4">
<CardHeader className="flex flex-row items-start justify-between">
<div className="flex items-start gap-4">
<div className="p-2 mt-1 rounded-md bg-secondary">
<Laptop className="w-6 h-6 text-secondary-foreground" />
</div>
<div>
<CardTitle className="text-lg">{title || "Untitled Canvas"}</CardTitle>
<p className="text-sm text-muted-foreground">HTML Document</p>
</div>
</div>
<DropdownMenu>
<DropdownMenuTrigger asChild>
<Button variant="ghost" size="icon">
<MoreHorizontal className="w-4 h-4" />
</Button>
</DropdownMenuTrigger>
<DropdownMenuContent align="end">
<DropdownMenuItem onClick={handleCopy}>
<Copy className="w-4 h-4 mr-2" />
Salin Kode
</DropdownMenuItem>
<DropdownMenuItem onClick={() => alert('Fitur Edit akan datang!')}>
<Code className="w-4 h-4 mr-2" />
Edit Kode
</DropdownMenuItem>
<DropdownMenuItem onClick={handleDownload}>
<Download className="w-4 h-4 mr-2" />
Download
</DropdownMenuItem>
</DropdownMenuContent>
</DropdownMenu>
</CardHeader>
<CardContent>
<Link href={`/canvas/${artifactId}`} target="_blank" passHref>
<Button className="w-full">
Buka di Canvas
</Button>
</Link>
</CardContent>
</Card>
)
  }
