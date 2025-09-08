'use client'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
const [email, setEmail] = useState('')
const [submitted, setSubmitted] = useState(false)
const router = useRouter()
const supabase = createClient()

const handleLogin = async (e: React.FormEvent) => {
e.preventDefault()
const { error } = await supabase.auth.signInWithOtp({
email,
options: {
emailRedirectTo: `${location.origin}/auth/callback`,
},
})
if (!error) {
setSubmitted(true)
} else {
console.error("Login error:", error.message)
}
}

useEffect(() => {
const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
if (session) {
router.push('/chat')
}
})

return () => {
subscription.unsubscribe()
}
}, [router, supabase])

if (submitted) {
return (
<main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
<div className="z-10 w-full max-w-md items-center justify-center font-mono text-sm flex flex-col gap-4 text-center">
<h1 className="text-2xl font-bold">Periksa Email Anda</h1>
<p className="text-muted-foreground">
Kami telah mengirimkan tautan ajaib ke {email}.
Klik tautan itu untuk masuk.
</p>
</div>
</main>
)
}

return (
<main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background">
<div className="z-10 w-full max-w-xs items-center justify-center font-mono text-sm flex flex-col gap-4">
<h1 className="text-2xl font-bold text-center">Masuk ke Gemini Chat</h1>
<form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
<Input
type="email"
placeholder="Email Anda"
value={email}
onChange={(e) => setEmail(e.target.value)}
required
/>
<Button type="submit">Kirim Tautan Ajaib</Button>
</form>
</div>
</main>
)
  }
