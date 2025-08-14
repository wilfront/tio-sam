'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'
import './dashboard.css'

export default function MensagensContato() {
  const [mensagens, setMensagens] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchMensagens()
  }, [])

  async function fetchMensagens() {
    const { data, error } = await supabase
      .from('mensagens_contato')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError('Erro ao buscar mensagens: ' + error.message)
    } else {
      setMensagens(data)
      setError(null)
    }
  }

  async function deleteMensagem(id) {
    const { error } = await supabase
      .from('mensagens_contato')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Erro ao deletar mensagem: ' + error.message)
    } else {
      setMensagens((prev) => prev.filter((msg) => msg.id !== id))
    }
  }

  return (
    <div className="mensagens-contato">
      <h2>Mensagens Recebidas</h2>

      {error && <p className="error">{error}</p>}

      {mensagens.length === 0 && <p>Nenhuma mensagem encontrada.</p>}

      {mensagens.map((msg) => (
        <div key={msg.id} className="mensagem-item">
          <p><strong>Nome:</strong> {msg.nome}</p>
          <p><strong>Email:</strong> {msg.email}</p>
          <p><strong>Motivo:</strong> {msg.motivo}</p>
          <p><strong>Assunto:</strong> {msg.assunto}</p>
          <p><strong>Mensagem:</strong> {msg.mensagem}</p>
          <p><small>Enviado em: {new Date(msg.created_at).toLocaleString()}</small></p>
          <button onClick={() => deleteMensagem(msg.id)}>Excluir</button>
        </div>
      ))}
    </div>
  )
}
