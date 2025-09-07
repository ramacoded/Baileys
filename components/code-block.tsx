'use client'

import { FC, memo } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { coldarkDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { useToast } from './ui/use-toast'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface Props {
language: string
value: string
}

const CodeBlock: FC<Props> = memo(({ language, value }) => {
const { toast } = useToast()
const [isCopied, setIsCopied] = useState(false)

const handleCopy = () => {
navigator.clipboard.writeText(value)
setIsCopied(true)
toast({ title: "Kode berhasil disalin!" })
setTimeout(() => setIsCopied(false), 2000)
}

return (
<div className="relative font-sans text-sm bg-[#363A48] rounded-md">
<div className="flex items-center justify-between px-4 py-2 border-b border-zinc-700">
<span className="text-xs text-zinc-300">{language}</span>
<button
className="flex items-center gap-1 text-xs text-zinc-300"
onClick={handleCopy}
>
{isCopied ? <Check size={16} /> : <Copy size={16} />}
{isCopied ? 'Disalin!' : 'Salin Kode'}
</button>
</div>
<SyntaxHighlighter
language={language}
style={coldarkDark}
customStyle={{
margin: 0,
padding: '1rem',
backgroundColor: '#363A48',
}}
>
{value}
</SyntaxHighlighter>
</div>
)
})

CodeBlock.displayName = 'CodeBlock'

export default CodeBlock