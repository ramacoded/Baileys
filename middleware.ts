import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Jalankan createClient untuk mendapatkan Supabase client dan respons yang bisa diubah
  const { supabase, response } = createClient(request)

  // Perbarui sesi pengguna berdasarkan cookie yang ada di request
  // Ini adalah langkah kunci yang memperbaiki bug
  const { data: { session } } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  // Jika pengguna belum login dan mencoba mengakses rute yang dilindungi (/chat)
  if (!session && pathname === '/chat') {
    // Arahkan mereka ke halaman login
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // Jika pengguna sudah login dan mencoba mengakses halaman login
  if (session && pathname === '/auth') {
    // Arahkan mereka langsung ke chat
    return NextResponse.redirect(new URL('/chat', request.url))
  }
  
  // Jika pengguna mengakses rute utama, arahkan ke login
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // Jika tidak ada pengalihan yang diperlukan, lanjutkan dan kembalikan respons
  // (yang mungkin berisi cookie sesi yang diperbarui)
  return response
}

export const config = {
  matcher: [
    '/',
    '/auth',
    '/chat',
  ],
}