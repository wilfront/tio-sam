import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('❌ Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request) {
  try {
    const { oldUsername, newUsername, newPassword } = await request.json()
    console.log('📩 Dados recebidos:', { oldUsername, newUsername })

    // Buscar usuário pelo nome antigo
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('username', oldUsername)
      .single()

    if (userError || !user) {
      console.log('❌ Usuário não encontrado:', userError)
      return NextResponse.json({ error: 'Usuário atual não encontrado' }, { status: 404 })
    }

    console.log('✅ Usuário encontrado:', user)

    // Monta objeto de atualização
    const updates = { username: newUsername }

    // Só altera a senha se for preenchida
    if (newPassword && newPassword.trim() !== '') {
      const salt = bcrypt.genSaltSync(10)
      updates.password_hash = bcrypt.hashSync(newPassword, salt)
    }

    // Atualiza no Supabase
    const { error: updateError } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)

    if (updateError) {
      console.log('❌ Erro ao atualizar:', updateError)
      return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 })
    }

    console.log('✅ Usuário atualizado com sucesso')
    return NextResponse.json({ message: 'Usuário atualizado com sucesso' })

  } catch (error) {
    console.error('❌ Erro interno no servidor:', error)
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 })
  }
}
