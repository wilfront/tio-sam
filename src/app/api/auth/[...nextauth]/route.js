import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Login',
      credentials: {
        username: { label: 'Usuário', type: 'text' },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        const { username, password } = credentials

        // Busca o usuário no Supabase
        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('username', username)
          .single()

        if (error || !user) {
          console.log('Usuário não encontrado:', error)
          return null
        }

        // Compara a senha digitada com o hash do banco
        const passwordMatch = await bcrypt.compare(password, user.password_hash)

        if (!passwordMatch) {
          console.log('Senha incorreta')
          return null
        }

        // Retorna usuário válido
        return { id: user.id, name: user.username }
      }
    })
  ],
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
