"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'
import { Lightbulb, Code, Palette, Rocket, Brain, Wand, Mail, Compass } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from "react-hot-toast"

const phrases = [
{ text: "Let's Design", icon: <Palette className="inline-block mr-2" />, bgColor: "bg-red-400" },
{ text: "Let's Code", icon: <Code className="inline-block mr-2" />, bgColor: "bg-blue-400" },
{ text: "Let's Create", icon: <Wand className="inline-block mr-2" />, bgColor: "bg-green-400" },
{ text: "Let's Explore", icon: <Compass className="inline-block mr-2" />, bgColor: "bg-purple-400" },
{ text: "Let's Go", icon: <Rocket className="inline-block mr-2" />, bgColor: "bg-orange-400" },
{ text: "DeepCore", icon: <Brain className="inline-block mr-2" />, bgColor: "bg-emerald-400" },
]

const GoogleIcon = () => (
<svg viewBox="0 0 48 48" className="w-5 h-5 mr-2">
<path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
<path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
<path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
<path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
l6.19,5.238C42.012,36.417,44,30.638,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
</svg>
)

export default function LandingPage() {
const [phraseIndex, setPhraseIndex] = useState(0)
const [displayedText, setDisplayedText] = useState("")
const [isDeleting, setIsDeleting] = useState(false)
const [email, setEmail] = useState('')
const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
const [submitted, setSubmitted] = useState(false)
const supabase = createClient()

const currentPhrase = phrases[phraseIndex].text
const currentBgColor = phrases[phraseIndex].bgColor

useEffect(() => {
let timeout: NodeJS.Timeout

if (isDeleting) {
if (displayedText.length > 0) {
timeout = setTimeout(() => {
setDisplayedText(current => current.slice(0, -1))
}, 50)
} else {
setIsDeleting(false)
setPhraseIndex(prev => (prev + 1) % phrases.length)
}
} else {
if (displayedText.length < currentPhrase.length) {
timeout = setTimeout(() => {
setDisplayedText(current => currentPhrase.slice(0, displayedText.length + 1))
}, 60)
} else {
const standbyTime = currentPhrase === "DeepCore" ? 5000 : 500
timeout = setTimeout(() => {
setIsDeleting(true)
}, standbyTime)
}
}

return () => clearTimeout(timeout)
}, [displayedText, isDeleting, phraseIndex, currentPhrase])


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
<div className={`relative flex flex-col items-center justify-center min-h-screen p-8 text-white transition-colors duration-1000 ${currentBgColor}`}>
<div className="flex-grow flex items-center justify-center text-center z-10">
<AnimatePresence mode="wait">
<motion.h1
key={phraseIndex}
initial={{ opacity: 0, y: -20 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: 20 }}
transition={{ duration: 0.4 }}
className="text-4xl md:text-6xl font-bold drop-shadow-lg"
>
{phrases[phraseIndex].icon}
{displayedText}
<span
className="inline-block w-1 h-10 md:h-16 bg-white ml-2 align-middle animate-blink"
/>
</motion.h1>
</AnimatePresence>
</div>

<div className="w-full max-w-xs space-y-3 z-10">
<Button
className="w-full py-3 text-base rounded-full bg-gray-600 text-white hover:bg-gray-700 flex items-center justify-center"
onClick={handleSignInWithGoogle}
>
<GoogleIcon />
Sign in with Google
</Button>
<Button
className="w-full py-3 text-base rounded-full bg-gray-600 text-white hover:bg-gray-700"
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
Enter your email below to receive a confirmation link to sign in.
</DialogDescription>
</DialogHeader>
{submitted ? (
<div className="text-center py-4">
<h3 className="font-bold">Check your inbox</h3>
<p className="text-sm text-gray-600">We've sent a confirmation link to {email}.</p>
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
Send Confirmation Link
</Button>
</form>
)}
</DialogContent>
</Dialog>
</div>
)
}