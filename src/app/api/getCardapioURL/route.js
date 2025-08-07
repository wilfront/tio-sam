import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
)

export async function GET() {
  try {
    const { data, error } = await supabase
      .storage
      .from('arquivos')
      .list('', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      })

    if (error) {
      console.error('Erro ao listar arquivos:', error)
      return NextResponse.json({ message: 'Erro ao listar arquivos' }, { status: 500 })
    }

    const pdfs = data.filter(file => file.name.endsWith('.pdf'))

    if (pdfs.length === 0) {
      return NextResponse.json({ message: 'Nenhum cardápio encontrado.' }, { status: 404 })
    }

    const ultimoArquivo = pdfs[0]

    const { data: urlData } = supabase
      .storage
      .from('arquivos')
      .getPublicUrl(ultimoArquivo.name)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (err) {
    console.error('Erro no servidor:', err)
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
