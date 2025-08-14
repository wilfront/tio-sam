import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function GET() {
  try {
    const { data, error } = await supabase.storage
      .from('arquivos')
      .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const pdfs = data.filter(file => file.name.endsWith('.pdf'))
    if (pdfs.length === 0) {
      return NextResponse.json({ message: 'Nenhum cardápio encontrado.' }, { status: 404 })
    }

    const ultimoArquivo = pdfs[0]

    const { data: urlData, error: urlError } = supabase.storage
      .from('arquivos')
      .getPublicUrl(ultimoArquivo.name)

    if (urlError) {
      return NextResponse.json({ error: urlError.message }, { status: 500 })
    }

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (err) {
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
