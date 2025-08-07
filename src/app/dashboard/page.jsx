import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import MensagensContato from './MensagensContato'
import UploadCardapio from './UploadCardapio'
import UpdateUserForm from './UpdateUserForm'  // importe aqui
import './dashboard.css'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <p style={{ padding: '2rem' }}>Você não tem permissão para acessar esta página.</p>
  }

  // Pega o username do usuário logado (ajuste conforme seu objeto de sessão)
  const currentUsername = session.user?.name || 'admin'

  return (
    <div className="dashboard-container">
      <div className="dashboard">
        <h1>Painel Administrativo</h1>

        <section>
          <h2>📄 Atualizar Cardápio (PDF)</h2>
          <UploadCardapio />
        </section>

        <hr style={{ margin: '3rem 0' }} />

        <section>
          <h2>📬 Mensagens Recebidas</h2>
          <MensagensContato />
        </section>

        <hr style={{ margin: '3rem 0' }} />

        <section>
          <UpdateUserForm currentUsername={currentUsername} />
        </section>
      </div>
    </div>
  )
}
