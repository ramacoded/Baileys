'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { UploadCloud, Camera, Link } from "lucide-react"
import React, { useRef } from "react"

interface AttachmentSheetProps {
onFilesSelect: (files: File[]) => void
}

export function AttachmentSheet({ onFilesSelect }: AttachmentSheetProps) {
const fileInputRef = useRef<HTMLInputElement>(null)

const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
const files = event.target.files
if (files && files.length > 0) {
onFilesSelect(Array.from(files))
}
}

const handleUploadClick = () => {
fileInputRef.current?.click()
}

return (
<div className="p-4">
<Tabs defaultValue="upload" className="w-full">
<TabsList className="grid w-full grid-cols-3">
<TabsTrigger value="upload">
<UploadCloud className="w-4 h-4 mr-2" />
Upload
</TabsTrigger>
<TabsTrigger value="camera">
<Camera className="w-4 h-4 mr-2" />
Kamera
</TabsTrigger>
<TabsTrigger value="url">
<Link className="w-4 h-4 mr-2" />
URL
</TabsTrigger>
</TabsList>
<TabsContent value="upload" className="mt-4">
<div
onClick={handleUploadClick}
className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted"
>
<UploadCloud className="w-10 h-10 text-muted-foreground" />
<p className="mt-2 text-sm text-muted-foreground">Klik untuk memilih file (Maks 10)</p>
<input
type="file"
ref={fileInputRef}
onChange={handleFileSelect}
className="hidden"
multiple
/>
</div>
</TabsContent>
<TabsContent value="camera" className="mt-4 text-center">
<p className="text-sm text-muted-foreground">Fitur kamera akan segera hadir.</p>
<Button className="mt-4" onClick={() => console.log("Buka Kamera")}>Buka Kamera</Button>
</TabsContent>
<TabsContent value="url" className="mt-4 text-center">
<p className="text-sm text-muted-foreground">Fitur lampirkan dari URL akan segera hadir.</p>
</TabsContent>
</Tabs>
</div>
)
}