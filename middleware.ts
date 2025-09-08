import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
const { supabase, response } = createClient(request)
const { data: { session } } = await supabase.auth.getSession()
const { pathname } = request.nextUrl

if (session && (pathname === '/auth' || pathname === '/')) {
return NextResponse.redirect(new URL('/chat', request.url))
}

if (!session && pathname === '/chat') {
return NextResponse.redirect(new URL('/auth', request.url))
}

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