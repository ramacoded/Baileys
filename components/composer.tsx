'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Paperclip, SendHorizontal, MoreHorizontal, LoaderCircle, Code, Image as ImageIcon } from 'lucide-react'
import React, { useState } from 'react'
import { AttachmentSheet } from './attachment-sheet'

interface ComposerProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
}

export default function Composer({ input, handleInputChange, handleSubmit, isLoading }: ComposerProps) {
  const [sheetOpen, setSheetOpen] = useState(false)

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleSubmit(e)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const form = e.currentTarget.form
      if (form) {
        form.requestSubmit()
      }
    }
  }

  return (
    <TooltipProvider delayDuration={0}>
      <footer className="bg-background/95 backdrop-blur-sm border-t">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <form onSubmit={handleFormSubmit} className="relative flex items-center">
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
                <AttachmentSheet />
              </SheetContent>
            </Sheet>

            <Textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ketik pesan..."
              className="w-full rounded-2xl p-3 pl-12 pr-24 resize-none border-border/40 shadow-sm"
              rows={1}
              disabled={isLoading}
            />
            <div className="absolute right-2 flex items-center gap-1">
              <DropdownMenu>
                <Tooltip>
                  <DropdownMenuTrigger asChild>
                    <Button type="button" variant="ghost" size="icon" disabled={isLoading}>
                      <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <TooltipContent>Opsi Lainnya</TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => console.log('Buka Canvas')}>
                    <Code className="w-4 h-4 mr-2" />
                    <span>Canvas</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log('Generate Image')}>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    <span>Generate Image</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="submit" size="icon" className="rounded-full w-8 h-8" disabled={isLoading || !input}>
                    {isLoading ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <SendHorizontal className="w-4 h-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Kirim Pesan</TooltipContent>
              </Tooltip>
            </div>
          </form>
        </div>
      </footer>
    </TooltipProvider>
  )
      }
