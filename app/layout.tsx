import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
title: "DeepCore",
description: "Chatbot AI dengan Gemini dan Next.js",
icons: {
icon: '/icon.png',
apple: '/apple-icon.png',
shortcut: '/favicon.ico',
},
}

export default function RootLayout({
children,
}: Readonly<{
children: React.ReactNode
}>) {
return (
<html lang="en" suppressHydrationWarning>
<body className={`${inter.className} flex flex-col min-h-screen`}>
<ThemeProvider
attribute="class"
defaultTheme="dark"
enableSystem
disableTransitionOnChange
>
{children}
<Toaster />
</ThemeProvider>
</body>
</html>
)
}