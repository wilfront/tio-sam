import { supabase } from './supabase'

export async function enviarMensagem({ nome, email, motivo, assunto, mensagem }) {
  try {
    const { error } = await supabase
      .from('mensagens_contato')
      .insert([{ nome, email, motivo, assunto, mensagem }])

    if (error) {
      console.error('Erro ao inserir mensagem:', error.message)
      console.log('Detalhes do erro:', error.details)
      return false
    }

    return true
  } catch (err) {
    console.error('Erro no envio:', err.message)
    return false
  }
}
