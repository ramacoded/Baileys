'use client'

export default function ChatWindow() {
  const messages: any[] = []
  const showWelcome = messages.length === 0

  return (
    <main className="flex-1 overflow-y-auto pt-20 pb-32">
      <div className="max-w-3xl mx-auto px-4">
        {showWelcome && (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)]">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-muted-foreground/80">
              Halo, ada yang bisa dibantu?
            </h1>
          </div>
        )}
        <div className="flex flex-col gap-4">
          {/* Daftar pesan akan muncul di sini */}
        </div>
      </div>
    </main>
  )
}