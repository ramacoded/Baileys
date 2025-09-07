import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
const { session_id, role, content } = await request.json()
const supabase = createClient()

const { data: { user } } = await supabase.auth.getUser()
if (!user) {
return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

if (!session_id || !role || !content) {
return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
}

const { error } = await supabase
.from('messages')
.insert({ session_id, role, content })

if (error) {
console.error('Error saving message:', error)
return NextResponse.json({ error: error.message }, { status: 500 })
}

return NextResponse.json({ success: true })
}