'use client'

import { useState } from 'react'
import './contato.css'
import { enviarMensagem } from '@/utils/enviarMensagem'
import { motion } from 'framer-motion'

export default function Contato() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    motivo: '',
    assunto: '',
    mensagem: '',
  })

  const [status, setStatus] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('Enviando...')
    const sucesso = await enviarMensagem(form)
    if (sucesso) {
      setStatus('Mensagem enviada com sucesso!')
      setForm({
        nome: '',
        email: '',
        motivo: '',
        assunto: '',
        mensagem: '',
      })
    } else {
      setStatus('Erro ao enviar a mensagem. Tente novamente.')
    }
  }

  return (
    <section className="contato">
      <div className="contato-container">
        <motion.h1
          className="contato-titulo"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Fale com a gente
        </motion.h1>

        <motion.form
          className="contato-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <label>
            Nome:
            <motion.input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
              whileFocus={{ scale: 1.03 }}
            />
          </label>

          <label>
            Email:
            <motion.input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              whileFocus={{ scale: 1.03 }}
            />
          </label>

          <label>
            Motivo do contato:
            <motion.select
              name="motivo"
              value={form.motivo}
              onChange={handleChange}
              required
              whileFocus={{ scale: 1.03 }}
            >
              <option value="">Selecione um motivo</option>
              <option value="Dúvidas">Dúvidas</option>
              <option value="Sugestões">Sugestões</option>
              <option value="Reclamações">Reclamações</option>
              <option value="Elogios">Elogios</option>
            </motion.select>
          </label>

          <label>
            Assunto:
            <motion.input
              type="text"
              name="assunto"
              value={form.assunto}
              onChange={handleChange}
              required
              whileFocus={{ scale: 1.03 }}
            />
          </label>

          <label>
            Mensagem:
            <motion.textarea
              name="mensagem"
              rows="5"
              value={form.mensagem}
              onChange={handleChange}
              required
              whileFocus={{ scale: 1.02 }}
            />
          </label>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Enviar
          </motion.button>
        </motion.form>

        {/* Mensagem de status */}
        {status && (
          <motion.p
            className={`form-status ${
              status.includes('sucesso') ? 'form-status-success' : 'form-status-error'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {status}
          </motion.p>
        )}
      </div>
    </section>
  )
}
