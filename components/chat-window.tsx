'use client'
export default function ChatWindow() {
const messages: any[] = []
const showWelcome = messages.length === 0
return (
<div className="h-full overflow-y-auto pt-20 pb-24 px-4 md:px-8">
{showWelcome && (
<div className="flex flex-col items-center justify-center h-full">
<h1 className="text-4xl md:text-6xl font-bold text-center text-muted-foreground/50">
Halo, ada yang bisa dibantu?
</h1>
</div>
)}
<div className="flex flex-col gap-4">
</div>
</div>
)
}