import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
const supabase = createClient()
const { data: { user } } = await supabase.auth.getUser()

if (!user) {
return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

const { data, error } = await supabase
.from('sessions')
.select('id, title')
.eq('user_id', user.id)
.order('created_at', { ascending: false })

if (error) {
return NextResponse.json({ error: error.message }, { status: 500 })
}

return NextResponse.json(data)
}

export async function POST(request: Request) {
const { title } = await request.json()
const supabase = createClient()

const { data: { user } } = await supabase.auth.getUser()

if (!user) {
return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

const { data, error } = await supabase
.from('sessions')
.insert({ title: title, user_id: user.id })
.select('id')
.single()

if (error) {
return NextResponse.json({ error: error.message }, { status: 500 })
}

return NextResponse.json({ id: data.id })
}