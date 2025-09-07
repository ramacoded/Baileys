'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Laptop } from "lucide-react"

interface CanvasCardProps {
  title: string
  onPreview: () => void
}

export function CanvasCard({ title, onPreview }: CanvasCardProps) {
  const now = new Date()
  const timestamp = `${now.getDate()} Sep, ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`

  return (
    <Card className="max-w-md my-4">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-md bg-secondary">
            <Laptop className="w-6 h-6 text-secondary-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg">{title || "Untitled Canvas"}</CardTitle>
            <p className="text-sm text-muted-foreground">{timestamp}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Gemini Canvas adalah ruang kerja visual interaktif untuk membuat dan menyunting dokumen maupun kode dengan AI.
        </p>
        <Button onClick={onPreview} className="w-full">
          Buka di Canvas
        </Button>
      </CardContent>
    </Card>
  )
          }
