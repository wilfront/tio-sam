'use client'
import { useState } from 'react'
import './UpdateUserForm.css'

export default function UpdateUserForm({ currentUsername }) {
  const [oldUsername] = useState(currentUsername)
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    const res = await fetch('/api/user/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldUsername, newUsername, newPassword })
    })

    const data = await res.json()
    if (res.ok) {
      setMessage('Usuário atualizado com sucesso!')
      setError(false)
    } else {
      setMessage(`Erro: ${data.error}`)
      setError(true)
    }
  }

  return (
    <form className="update-user-form" onSubmit={handleSubmit}>
      <h2>Alterar Usuário e Senha</h2>
      <p>Usuário atual: {oldUsername}</p>
      <input
        type="text"
        placeholder="Novo usuário"
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Nova senha"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <button type="submit">Atualizar</button>
      {message && (
        <p className={error ? 'error-message' : 'success-message'}>
          {message}
        </p>
      )}
    </form>
  )
}
