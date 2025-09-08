'use client'

export function TypingIndicator() {
return (
<div className="group relative mb-4 flex items-start justify-start">
<div className="flex items-center rounded-lg px-4 py-3 bg-muted">
<span
className="h-2 w-2 animate-pulse-dot rounded-full bg-muted-foreground"
/>
</div>
</div>
)
}