'use client'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion' // ✅ import motion
import './login.css'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [form, setForm] = useState({ username: '', password: '' })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await signIn('credentials', {
      ...form,
      redirect: false
    })

    if (res.ok) {
      router.push('/dashboard')
    } else {
      setError('Usuário ou senha inválidos')
    }
  }

  return (
    <motion.div
      className="login-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.form
        className="login-box"
        onSubmit={handleSubmit}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h1>Login do Painel</h1>
        <input name="username" placeholder="Usuário" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Senha" onChange={handleChange} required />
        <button type="submit">Entrar</button>
        {error && <p>{error}</p>}
      </motion.form>
    </motion.div>
  )
}
