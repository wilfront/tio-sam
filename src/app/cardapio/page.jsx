'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import './cardapio.css'

export default function CardapioPage() {
  const [cardapios, setCardapios] = useState([]) // {name, url}

  useEffect(() => {
    async function fetchCardapios() {
      // 1) Busca lista de nomes dos PDFs
      const res = await fetch('/api/upload-cardapio')
      const data = await res.json()

      if (!res.ok || !data.pdfs) {
        setCardapios([])
        return
      }

      // 2) Para cada arquivo, busca URL pública
      const cardapiosComUrl = await Promise.all(
        data.pdfs.map(async (file) => {
          const resUrl = await fetch(`/api/getPublicUrl?fileName=${encodeURIComponent(file.name)}`)
          const dataUrl = await resUrl.json()
          return {
            name: file.name,
            url: resUrl.ok ? dataUrl.url : null
          }
        })
      )

      // 3) Salva no estado para renderizar
      setCardapios(cardapiosComUrl.filter(c => c.url))
    }

    fetchCardapios()
  }, [])

  return (
    <div className='cardapio-container'>
      <motion.div
        className="cardapio-page"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h1>📄 Baixar Cardápio</h1>
        {cardapios.length > 0 ? (
          <ul>
            {cardapios.map(({ name, url }) => (
              <li key={name}>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {name}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>Carregando ou nenhum cardápio disponível.</p>
        )}
      </motion.div>
    </div>
  )
}
