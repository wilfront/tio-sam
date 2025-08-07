'use client'

import { useState, useEffect } from 'react'

export default function UploadCardapio() {
  const [message, setMessage] = useState('')
  const [pdfs, setPdfs] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPdfs()
  }, [])

  async function fetchPdfs() {
    setLoading(true)
    try {
      const res = await fetch('/api/upload-cardapio')
      const data = await res.json()
      if (res.ok) setPdfs(data.pdfs)
      else setMessage(data.error || 'Erro ao buscar arquivos')
    } catch {
      setMessage('Erro na requisição')
    }
    setLoading(false)
  }

  async function handleDelete(fileName) {
    if (!confirm(`Tem certeza que quer deletar o arquivo ${fileName}?`)) return
    try {
      const res = await fetch(`/api/upload-cardapio?fileName=${encodeURIComponent(fileName)}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok) {
        setMessage(data.message)
        fetchPdfs()
      } else setMessage(data.error || 'Erro ao deletar')
    } catch {
      setMessage('Erro na requisição')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    const formData = new FormData(e.target)
    try {
      const res = await fetch('/api/upload-cardapio', { method: 'POST', body: formData })
      const data = await res.json()
      if (res.ok) {
        setMessage(data.message)
        fetchPdfs()
        e.target.reset()
      } else setMessage(data.error || 'Erro no upload')
    } catch {
      setMessage('Erro na requisição')
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '1rem' }}>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <input type="file" name="file" accept="application/pdf" required />
        <button type="submit" style={{ marginLeft: '1rem' }}>Enviar Cardápio</button>
      </form>

      {message && <p>{message}</p>}

      <hr style={{ margin: '2rem 0' }} />

      <h3>Cardápios disponíveis:</h3>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {pdfs.length === 0 && <li>Nenhum cardápio encontrado.</li>}
          {pdfs.map((pdf) => (
            <li key={pdf.name} style={{ marginBottom: '0.7rem' }}>
              {pdf.name}{' '}
              <button
                onClick={() => handleDelete(pdf.name)}
                style={{
                  color: 'white',
                  backgroundColor: 'red',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.2rem 0.5rem',
                  cursor: 'pointer'
                }}
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
