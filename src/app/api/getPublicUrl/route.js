import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const fileName = searchParams.get('fileName')

    if (!fileName) {
      return NextResponse.json({ error: 'Parâmetro fileName é obrigatório' }, { status: 400 })
    }

    const { data, error } = supabase.storage
      .from('arquivos')
      .getPublicUrl(fileName)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ url: data.publicUrl })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
