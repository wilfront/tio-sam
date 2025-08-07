'use client'
import React, { useState, useEffect } from 'react'
import './uploadCardapio.css'

export default function UploadCardapio() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [pdfs, setPdfs] = useState([])
  const [loadingPdfs, setLoadingPdfs] = useState(false)

  useEffect(() => {
    fetchPdfs()
  }, [])

  async function fetchPdfs() {
    setLoadingPdfs(true)
    try {
      const res = await fetch('/api/upload-cardapio')
      const data = await res.json()
      if (res.ok) {
        setPdfs(data.pdfs)
      } else {
        setMessage(data.error || 'Erro ao buscar arquivos')
      }
    } catch {
      setMessage('Erro ao conectar para buscar arquivos')
    }
    setLoadingPdfs(false)
  }

  const handleUpload = async () => {
    if (!file) return setMessage('Selecione um arquivo primeiro.')

    setUploading(true)
    setMessage('Enviando...')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload-cardapio', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setMessage('Upload feito com sucesso!')
        setFile(null)
        fetchPdfs()
      } else {
        setMessage(result.error || 'Erro ao enviar.')
      }
    } catch (err) {
      setMessage('Erro ao conectar com o servidor.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (fileName) => {
    if (!confirm(`Quer realmente deletar o arquivo ${fileName}?`)) return

    try {
      const res = await fetch(`/api/upload-cardapio?fileName=${encodeURIComponent(fileName)}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok) {
        setMessage(data.message)
        fetchPdfs()
      } else {
        setMessage(data.error || 'Erro ao deletar arquivo')
      }
    } catch {
      setMessage('Erro ao conectar com o servidor.')
    }
  }

  return (
    <div className="upload-container">
      <div className="upload-form">
        <input
          type="file"
          accept="application/pdf"
          onChange={e => setFile(e.target.files[0])}
          disabled={uploading}
        />
        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Enviando...' : 'Enviar Cardápio'}
        </button>
      </div>

      {message && <p className="upload-message">{message}</p>}

      <hr className="upload-divider" />

      <h3 className="upload-title">Cardápios disponíveis:</h3>
      {loadingPdfs ? (
        <p>Carregando arquivos...</p>
      ) : (
        <ul className="pdf-list">
          {pdfs.length === 0 && <li>Nenhum cardápio encontrado.</li>}
          {pdfs.map(pdf => (
            <li key={pdf.name} className="pdf-item">
              <span>{pdf.name}</span>
              <button onClick={() => handleDelete(pdf.name)} className="delete-btn">
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
