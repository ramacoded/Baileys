'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface CanvasPanelProps {
  htmlContent: string | null
  onOpenChange: (open: boolean) => void
}

export function CanvasPanel({ htmlContent, onOpenChange }: CanvasPanelProps) {
  const isOpen = htmlContent !== null

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-3/4 lg:w-1/2 p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Canvas Preview</SheetTitle>
        </SheetHeader>
        <div className="w-full h-[calc(100%-65px)]">
          <iframe
            srcDoc={htmlContent || ""}
            title="Canvas Preview"
            sandbox="allow-scripts"
            className="w-full h-full border-0"
          />
        </div>
      </SheetContent>
    </Sheet>
  )
            }
