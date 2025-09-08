import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export function createClient(request: NextRequest) {
  // Buat respons Next.js yang bisa kita modifikasi
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Buat Supabase client yang bisa membaca dan menulis cookie
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Jika Supabase client perlu mengatur cookie, kita akan menambahkannya ke respons
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          // Jika Supabase client perlu menghapus cookie, kita akan melakukannya di respons
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  return { supabase, response }
}