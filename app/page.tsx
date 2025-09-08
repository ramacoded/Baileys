"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { Globe, Lightbulb, Code, Palette, Rocket, Zap, Brain, Wand } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

const phrases = [
{ text: "Let's design", icon: <Palette className="inline-block mr-2" />, bgColor: "bg-red-400" },
{ text: "Let's code", icon: <Code className="inline-block mr-2" />, bgColor: "bg-blue-400" },
{ text: "Let's create", icon: <Wand className="inline-block mr-2" />, bgColor: "bg-green-400" },
{ text: "Let's explore", icon: <Globe className="inline-block mr-2" />, bgColor: "bg-purple-400" },
{ text: "Let's innovate", icon: <Lightbulb className="inline-block mr-2" />, bgColor: "bg-yellow-400" },
{ text: "Let's go", icon: <Rocket className="inline-block mr-2" />, bgColor: "bg-orange-400" },
{ text: "Core AI", icon: <Brain className="inline-block mr-2" />, bgColor: "bg-emerald-400" },
]

export default function LandingPage() {
const router = useRouter()
const [phraseIndex, setPhraseIndex] = useState(0)
const [displayedText, setDisplayedText] = useState("")
const [isTyping, setIsTyping] = useState(true)
const [charIndex, setCharIndex] = useState(0)
const [cursorVisible, setCursorVisible] = useState(true)

const currentPhrase = phrases[phraseIndex].text
const currentBgColor = phrases[phraseIndex].bgColor

useEffect(() => {
// Typing effect
if (isTyping && charIndex < currentPhrase.length) {
const typingTimeout = setTimeout(() => {
setDisplayedText(currentPhrase.substring(0, charIndex + 1))
setCharIndex(charIndex + 1)
}, 100)
return () => clearTimeout(typingTimeout)
}
// Pause at end of typing
else if (isTyping && charIndex === currentPhrase.length) {
const pauseTimeout = setTimeout(() => {
setIsTyping(false)
}, 1500)
return () => clearTimeout(pauseTimeout)
}
// Deleting effect
else if (!isTyping && charIndex > 0) {
const deletingTimeout = setTimeout(() => {
setDisplayedText(currentPhrase.substring(0, charIndex - 1))
setCharIndex(charIndex - 1)
}, 50)
return () => clearTimeout(deletingTimeout)
}
// Move to next phrase after deleting
else if (!isTyping && charIndex === 0) {
const nextPhraseTimeout = setTimeout(() => {
setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length)
setIsTyping(true)
}, 500)
return () => clearTimeout(nextPhraseTimeout)
}
}, [charIndex, isTyping, currentPhrase, phraseIndex])

useEffect(() => {
const cursorInterval = setInterval(() => {
setCursorVisible((prev) => !prev)
}, 500)
return () => clearInterval(cursorInterval)
}, [])

const handleLogin = () => {
router.push('/chat')
}

return (
<div
className={`flex flex-col items-center justify-between min-h-screen p-8 transition-colors duration-1000 ${currentBgColor}`}
>
<div className="flex-grow flex items-center justify-center text-center">
<AnimatePresence mode="wait">
<motion.h1
key={phraseIndex}
initial={{ opacity: 0, y: -20 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: 20 }}
transition={{ duration: 0.3 }}
className="text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg"
>
{phrases[phraseIndex].icon}
{displayedText}
<span
className={`inline-block w-4 h-8 bg-white ml-2 align-bottom rounded-full transition-opacity duration-200 ${cursorVisible ? 'opacity-100' : 'opacity-0'}`}
style={{ transition: 'opacity 0.2s ease-in-out' }}
/>
</motion.h1>
</AnimatePresence>
</div>

<div className="w-full max-w-sm space-y-4 mb-16">
<Button
className="w-full py-6 text-lg rounded-xl bg-white text-gray-800 hover:bg-gray-100 transition-colors"
onClick={handleLogin}
>
<GitHubLogoIcon className="h-6 w-6 mr-3" />
Continue with GitHub
</Button>
<Button className="w-full py-6 text-lg rounded-xl bg-gray-800 text-white hover:bg-gray-700 transition-colors">
Sign up
</Button>
<Button className="w-full py-6 text-lg rounded-xl bg-black text-white hover:bg-gray-900 transition-colors">
Log in
</Button>
</div>
</div>
)
}