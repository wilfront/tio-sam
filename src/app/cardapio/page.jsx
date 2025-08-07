'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import './cardapio.css'

export default function CardapioPage() {
  const [url, setUrl] = useState(null)

  useEffect(() => {
    async function fetchCardapio() {
      const res = await fetch('/api/getCardapioURL')
      const data = await res.json()
      if (res.ok) setUrl(data.url)
    }

    fetchCardapio()
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
        {url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            Clique aqui para baixar o cardápio (PDF)
          </a>
        ) : (
          <p>Carregando ou nenhum cardápio disponível.</p>
        )}
      </motion.div>
    </div>
  )
}
