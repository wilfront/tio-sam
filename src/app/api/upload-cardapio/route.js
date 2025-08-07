import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
)

export async function GET() {
  try {
    const { data, error } = await supabase.storage
      .from('arquivos')
      .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const pdfs = data.filter(file => file.name.endsWith('.pdf'))
    return NextResponse.json({ pdfs })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!file) return NextResponse.json({ error: 'Arquivo não enviado' }, { status: 400 })

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const fileName = `cardapio_${Date.now()}.pdf`

    const { error } = await supabase.storage
      .from('arquivos')
      .upload(fileName, buffer, { contentType: file.type, upsert: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ message: 'Upload realizado com sucesso!' })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const fileName = searchParams.get('fileName')

    if (!fileName) return NextResponse.json({ error: 'Nome do arquivo é obrigatório' }, { status: 400 })

    const { error } = await supabase.storage.from('arquivos').remove([fileName])

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ message: 'Arquivo deletado com sucesso' })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
