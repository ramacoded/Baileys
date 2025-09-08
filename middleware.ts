import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
const { supabase, response } = createClient(request)
const { data: { session } } = await supabase.auth.getSession()

const { pathname } = request.nextUrl

// Jika pengguna sudah login dan mencoba mengakses /auth, arahkan ke /chat
if (session && pathname === '/auth') {
return NextResponse.redirect(new URL('/chat', request.url))
}

// Jika pengguna belum login dan mencoba mengakses /chat, arahkan ke /auth
if (!session && pathname === '/chat') {
return NextResponse.redirect(new URL('/auth', request.url))
}

// Arahkan rute utama (/) ke halaman login (/auth)
if (pathname === '/') {
return NextResponse.redirect(new URL('/auth', request.url))
}

return response
}

export const config = {
matcher: [
'/',
'/auth',
'/chat',
],
}