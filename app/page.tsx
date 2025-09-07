const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
api: '/api/chat/stream',
body: {
activeFeature
},
onFinish: async (message) => {
if (activeFeature === 'canvas') {
toast.loading('Menerima hasil canvas, menyimpan...')
try {
const response = await fetch('/api/artifacts', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
htmlContent: message.content,
title: "Hasil Canvas Otomatis"
})
})

toast.dismiss()
if (!response.ok) {
toast.error('Gagal menyimpan ke server.')
throw new Error(`Server error: ${response.statusText}`)
}

const data = await response.json()

if (data.id) {
toast.success('Canvas berhasil disimpan, menampilkan kartu.')
const artifactMessage = {
role: 'system' as const,
content: JSON.stringify({
type: 'canvas-card',
artifactId: data.id,
title: "Hasil Canvas Otomatis",
htmlContent: message.content
})
}
append(artifactMessage)
} else {
toast.error('Server tidak mengembalikan ID artifact.')
}
} catch (error) {
toast.dismiss()
toast.error('Terjadi kesalahan saat menyimpan canvas.')
console.error(error)
}
}
setActiveFeature('none')
},
onError: (error) => {
toast.error(error.message)
},
})
