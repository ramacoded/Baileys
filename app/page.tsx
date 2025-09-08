"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'
import { Lightbulb, Code, Palette, Rocket, Brain, Wand, Mail } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from "react-hot-toast"

const phrases = [
{ text: "let's design", icon: <Palette className="inline-block mr-2" />, bgColor: "bg-red-400" },
{ text: "let's code", icon: <Code className="inline-block mr-2" />, bgColor: "bg-blue-400" },
{ text: "let's create", icon: <Wand className="inline-block mr-2" />, bgColor: "bg-green-400" },
{ text: "explorate", icon: <Rocket className="inline-block mr-2" />, bgColor: "bg-purple-400" },
{ text: "let's go", icon: <Rocket className="inline-block mr-2" />, bgColor: "bg-orange-400" },
{ text: "Core AI", icon: <Brain className="inline-block mr-2" />, bgColor: "bg-emerald-400" },
]

export default function LandingPage() {
const [phraseIndex, setPhraseIndex] = useState(0)
const [displayedText, setDisplayedText] = useState("")
const [isTyping, setIsTyping] = useState(true)
const [charIndex, setCharIndex] = useState(0)
const [email, setEmail] = useState('')
const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
const [submitted, setSubmitted] = useState(false)
const supabase = createClient()

const currentPhrase = phrases[phraseIndex].text
const currentBgColor = phrases[phraseIndex].bgColor

useEffect(() => {
if (isTyping && charIndex < currentPhrase.length) {
const typingTimeout = setTimeout(() => {
setDisplayedText(currentPhrase.substring(0, charIndex + 1))
setCharIndex(charIndex + 1)
}, 100)
return () => clearTimeout(typingTimeout)
} else if (isTyping && charIndex === currentPhrase.length) {
const pauseTimeout = setTimeout(() => setIsTyping(false), 2000)
return () => clearTimeout(pauseTimeout)
} else if (!isTyping && charIndex > 0) {
const deletingTimeout = setTimeout(() => {
setDisplayedText(currentPhrase.substring(0, charIndex - 1))
setCharIndex(charIndex - 1)
}, 50)
return () => clearTimeout(deletingTimeout)
} else if (!isTyping && charIndex === 0) {
const nextPhraseTimeout = setTimeout(() => {
setPhraseIndex((prev) => (prev + 1) % phrases.length)
setIsTyping(true)
}, 500)
return () => clearTimeout(nextPhraseTimeout)
}
}, [charIndex, isTyping, currentPhrase, phraseIndex])

const handleSignInWithGoogle = async () => {
await supabase.auth.signInWithOAuth({
provider: 'google',
options: {
redirectTo: `${location.origin}/auth/callback`,
},
})
}

const handleEmailSignIn = async (e: React.FormEvent) => {
e.preventDefault()
const { error } = await supabase.auth.signInWithOtp({
email,
options: {
emailRedirectTo: `${location.origin}/auth/callback`,
},
})
if (error) {
toast.error(error.message)
} else {
setSubmitted(true)
}
}

return (
<div className={`flex flex-col items-center justify-center min-h-screen p-8 text-white transition-colors duration-1000 ${currentBgColor}`}>
<div className="flex-grow flex items-center justify-center text-center">
<AnimatePresence mode="wait">
<motion.h1
key={phraseIndex}
initial={{ opacity: 0, y: -20 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: 20 }}
transition={{ duration: 0.3 }}
className="text-4xl md:text-6xl font-bold drop-shadow-lg"
>
{phrases[phraseIndex].icon}
{displayedText}
<span
className="inline-block w-1 h-10 md:h-16 bg-white ml-2 align-middle"
/>
</motion.h1>
</AnimatePresence>
</div>

<div className="w-full max-w-xs space-y-3">
<Button
className="w-full py-3 text-base rounded-full bg-white text-gray-800 hover:bg-gray-200"
onClick={handleSignInWithGoogle}
>
Sign in with Google
</Button>
<Button
className="w-full py-3 text-base rounded-full bg-white text-gray-800 hover:bg-gray-200"
onClick={() => setIsEmailDialogOpen(true)}
>
<Mail className="w-5 h-5 mr-2" />
Sign in with Email
</Button>
</div>

<Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
<DialogContent className="sm:max-w-md bg-white text-black">
<DialogHeader>
<DialogTitle>Sign in with Email</DialogTitle>
<DialogDescription>
Enter your email below to receive a magic link to sign in.
</DialogDescription>
</DialogHeader>
{submitted ? (
<div className="text-center py-4">
<h3 className="font-bold">Check your inbox</h3>
<p className="text-sm text-gray-600">We've sent a magic link to {email}.</p>
</div>
) : (
<form onSubmit={handleEmailSignIn} className="flex flex-col gap-4">
<Input
type="email"
placeholder="you@example.com"
value={email}
onChange={(e) => setEmail(e.target.value)}
required
className="bg-gray-100 border-gray-300"
/>
<Button type="submit" className="bg-black text-white hover:bg-gray-800">
Send Magic Link
</Button>
</form>
)}
</DialogContent>
</Dialog>
</div>
)
}