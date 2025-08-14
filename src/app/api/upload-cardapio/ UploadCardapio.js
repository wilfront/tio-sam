'use client'

import { useState } from 'react'

export default function UploadCardapio() {
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file) {
      setMessage('Selecione um arquivo antes de enviar.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload-cardapio', {
      method: 'POST',
      body: formData
    })

    const data = await res.json()
    if (res.ok) {
      setMessage(data.message)
      setFile(null)
    } else {
      setMessage(data.error || 'Erro ao enviar arquivo.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept="application/pdf"
        onChange={e => setFile(e.target.files[0])}
      />
      <button type="submit">Enviar Cardápio</button>
      {message && <p>{message}</p>}
    </form>
  )
}
