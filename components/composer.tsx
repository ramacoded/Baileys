'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Paperclip, SendHorizontal, MoreHorizontal, LoaderCircle, Code, Image as ImageIcon, X, FileText, FileCode2, Brush, FileJson2, FileArchive } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { AttachmentSheet } from './attachment-sheet'

export type ActiveFeature = 'none' | 'canvas' | 'image-gen'

interface ComposerProps {
input: string
handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => void
handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
isLoading: boolean
activeFeature: ActiveFeature
onFeatureSelect: (feature: ActiveFeature) => void
uploadedFiles: File[]
setUploadedFiles: React.Dispatch<React.SetStateAction<File[]>>
}

export default function Composer({
input,
handleInputChange,
handleSubmit,
isLoading,
activeFeature,
onFeatureSelect,
uploadedFiles,
setUploadedFiles
}: ComposerProps) {
const [sheetOpen, setSheetOpen] = useState(false)
const [previewImage, setPreviewImage] = useState<string | null>(null)
const [isZoomed, setIsZoomed] = useState(false)

useEffect(() => {
const objectUrls = uploadedFiles.map(file => URL.createObjectURL(file))
return () => {
objectUrls.forEach(url => URL.revokeObjectURL(url))
}
}, [uploadedFiles])

const handleFilesSelect = (newFiles: File[]) => {
setUploadedFiles(prevFiles => {
const combined = [...prevFiles, ...newFiles]
return combined.slice(0, 10)
})
setSheetOpen(false)
}

const handleRemoveFile = (indexToRemove: number) => {
setUploadedFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove))
}

const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
if (e.key === 'Enter' && e.ctrlKey) {
e.preventDefault()
const form = e.currentTarget.form
if (form) {
form.requestSubmit()
}
}
}

const handlePreviewInteractionStart = () => {
setIsZoomed(true)
}

const handlePreviewInteractionEnd = () => {
setIsZoomed(false)
}

const getFileIcon = (fileName: string) => {
const extension = fileName.split('.').pop()?.toLowerCase()
const baseClassName = "w-8 h-8 flex-shrink-0 mr-2"
switch (extension) {
case 'js':
case 'jsx':
case 'ts':
case 'tsx':
case 'py':
case 'html':
return <FileCode2 className={`${baseClassName} text-indigo-400`} />
case 'css':
case 'scss':
return <Brush className={`${baseClassName} text-pink-400`} />
case 'json':
return <FileJson2 className={`${baseClassName} text-yellow-400`} />
case 'zip':
case 'rar':
case '7z':
return <FileArchive className={`${baseClassName} text-gray-400`} />
default:
return <FileText className={`${baseClassName} text-blue-400`} />
}
}

const renderActiveFeatureIcon = () => {
if (activeFeature === 'canvas') {
return (
<div className="relative">
<Code className="w-5 h-5 text-current" />
<span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-blue-400" />
</div>
)
} else if (activeFeature === 'image-gen') {
return (
<div className="relative">
<ImageIcon className="w-5 h-5 text-current" />
<span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-blue-400" />
</div>
)
}
return <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
}

return (
<TooltipProvider delayDuration={0}>
<footer className="bg-muted border-t">
{uploadedFiles.length > 0 && (
<div className="p-2 overflow-x-auto">
<div className="flex gap-2">
{uploadedFiles.map((file, index) => {
const isImage = file.type.startsWith('image/')
return (
<div key={index} className="relative flex-shrink-0">
{isImage ? (
<img
src={URL.createObjectURL(file)}
alt={`preview ${index}`}
className="w-20 h-20 rounded-lg object-cover aspect-square cursor-pointer"
onClick={() => setPreviewImage(URL.createObjectURL(file))}
/>
) : (
<div className="w-48 h-20 rounded-lg bg-zinc-700 flex items-center p-3 text-white">
{getFileIcon(file.name)}
<div className="flex flex-col overflow-hidden">
<span className="truncate text-sm font-medium">{file.name}</span>
<span className="text-xs text-zinc-400">{(file.size / 1024).toFixed(2)} KB</span>
</div>
</div>
)}
<button
onClick={() => handleRemoveFile(index)}
className="absolute -top-1 -right-1 bg-black/60 text-white rounded-full p-0.5"
aria-label="Remove file"
>
<X className="w-3 h-3" />
</button>
</div>
)
})}
</div>
</div>
)}
<div className="max-w-3xl mx-auto px-4 py-3">
<form onSubmit={handleSubmit} className="relative flex items-center">
<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
<Tooltip>
<SheetTrigger asChild>
<Button type="button" variant="ghost" size="icon" className="absolute left-2" disabled={isLoading}>
<Paperclip className="w-5 h-5 text-muted-foreground" />
</Button>
</SheetTrigger>
<TooltipContent>Lampirkan File</TooltipContent>
</Tooltip>
<SheetContent side="bottom" className="rounded-t-lg">
<AttachmentSheet onFilesSelect={handleFilesSelect} />
</SheetContent>
</Sheet>

<Textarea
value={input}
onChange={handleInputChange}
onKeyDown={handleKeyDown}
placeholder="Ketik pesan..."
className="w-full rounded-2xl p-3 pl-12 pr-24 resize-none border-border h-12 min-h-0"
disabled={isLoading}
/>
<div className="absolute right-2 flex items-center gap-1">
<DropdownMenu>
<Tooltip>
<DropdownMenuTrigger asChild>
<Button
type="button"
variant="ghost"
size="icon"
disabled={isLoading}
className={activeFeature !== 'none' ? "text-blue-400" : ""}
>
{renderActiveFeatureIcon()}
</Button>
</DropdownMenuTrigger>
<TooltipContent>Opsi Lainnya</TooltipContent>
</Tooltip>
<DropdownMenuContent align="end">
<DropdownMenuItem
onClick={() => onFeatureSelect('canvas')}
className={activeFeature === 'canvas' ? 'bg-accent text-accent-foreground' : ''}
>
<Code className="w-4 h-4 mr-2" />
<span>Canvas</span>
</DropdownMenuItem>
<DropdownMenuItem
onClick={() => onFeatureSelect('image-gen')}
className={activeFeature === 'image-gen' ? 'bg-accent text-accent-foreground' : ''}
>
<ImageIcon className="w-4 h-4 mr-2" />
<span>Generate Image</span>
</DropdownMenuItem>
</DropdownMenuContent>
</DropdownMenu>

<Tooltip>
<TooltipTrigger asChild>
<Button type="submit" size="icon" className="rounded-full w-8 h-8" disabled={isLoading || (!input && uploadedFiles.length === 0)}>
{isLoading ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <SendHorizontal className="w-4 h-4" />}
</Button>
</TooltipTrigger>
<TooltipContent>Kirim Pesan</TooltipContent>
</Tooltip>
</div>
</form>
</div>
</footer>

{previewImage && (
<div
className="fixed inset-0 bg-black/75 flex items-center justify-center z-50"
onClick={() => setPreviewImage(null)}
>
<img
src={previewImage}
alt="Image preview"
className={`max-w-[90vw] max-h-[90vh] transition-transform duration-200 ease-in-out ${isZoomed ? 'scale-150' : 'scale-100'}`}
onClick={(e) => e.stopPropagation()}
onMouseDown={handlePreviewInteractionStart}
onMouseUp={handlePreviewInteractionEnd}
onMouseLeave={handlePreviewInteractionEnd}
onTouchStart={handlePreviewInteractionStart}
onTouchEnd={handlePreviewInteractionEnd}
/>
</div>
)}
</TooltipProvider>
)
}