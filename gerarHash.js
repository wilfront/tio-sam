import bcrypt from 'bcryptjs'

const senha = 'minhaSenha123'  // troque aqui para a senha que quer criar
const hash = bcrypt.hashSync(senha, 10)  // gera o hash da senha

console.log('Hash da senha:', hash)
