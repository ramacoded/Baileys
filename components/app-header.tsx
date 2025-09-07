'use client'

import { Bot, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const canvasExplanation = `
# 📌 Gemini Canvas — Penjelasan Lengkap Fitur

## Apa Itu Gemini Canvas?
**Gemini Canvas** adalah **ruang kerja interaktif (workspace)** dalam aplikasi **Google Gemini**.  
Fungsinya untuk **menulis, mengedit, membangun kode, membuat prototipe aplikasi, dan mengubah hasil riset menjadi artefak baru** dengan bantuan AI—semuanya dalam satu layar.

Canvas ibarat "kanvas kosong" yang bisa diisi ide, lalu AI bantu mengolah menjadi **dokumen, aplikasi, quiz, infografis, atau halaman web**.

---

## 🛠️ Fitur Utama Gemini Canvas

### 1. Penulisan & Penyuntingan Dokumen
- Mulai dari **draf kosong** atau **prompt singkat**.
- Menu **Quick Edit** memungkinkan:
  - Ubah *tone* (formal, santai, persuasif, dll).
  - Pendekkan / panjangkan isi.
  - Format ulang jadi artikel, esai, laporan, dsb.

### 2. Pembuatan & Review Kode
- Bisa **menghasilkan kode** (HTML, CSS, JS, Python, dll).
- Ada **live preview** langsung di kanvas → lihat hasil kode berjalan.
- Iterasi cepat: Refactor kode, tambahkan komentar, visualisasikan algoritma.

---

### 3. Integrasi Deep Research
- Hasil laporan riset bisa diubah jadi:
  - **Halaman web interaktif**.
  - **Infografis**.
  - **Quiz** (tanya jawab interaktif).
`

export default function AppHeader() {
  return (
    <header className="h-16 px-4 border-b flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Bot className="w-6 h-6" />
        <span className="font-semibold">Gemini Chat</span>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Info className="w-5 h-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tentang Fitur Canvas</DialogTitle>
          </DialogHeader>
          <div className="prose prose-stone dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {canvasExplanation}
            </ReactMarkdown>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}
