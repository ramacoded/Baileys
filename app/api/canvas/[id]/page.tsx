import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export const revalidate = 0

async function getArtifactContent(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('artifacts')
    .select('content')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }
  return data.content
}

export default async function CanvasPreviewPage({ params }: { params: { id: string } }) {
  const htmlContent = await getArtifactContent(params.id)

  if (!htmlContent) {
    return notFound()
  }

  return (
    <div className="w-full h-screen">
      <iframe
        srcDoc={htmlContent}
        title="Canvas Preview"
        sandbox="allow-scripts" // Security sandbox
        className="w-full h-full border-0"
      />
    </div>
  )
                                                }
