import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { htmlContent, title } = await request.json()
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('artifacts')
    .insert({
      kind: 'html_preview',
      content: htmlContent,
      title: title,
      user_id: user.id, // Pastikan tabel artifacts punya kolom user_id
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error saving artifact:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ id: data.id })
}
