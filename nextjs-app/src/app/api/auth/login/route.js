import prisma from '@/lib/db'
import { generateToken, verifyPassword } from '@/lib/auth'

export async function POST(request) {
  const body = await request.json()
  const { username, password } = body

  if (!username || !password) {
    return Response.json({ error: 'Username e password sono obbligatori' }, { status: 400 })
  }

  const utente = await prisma.utente.findUnique({ where: { username } })
  if (!utente || !(await verifyPassword(password, utente.passwordHash))) {
    return Response.json({ error: 'Credenziali non valide' }, { status: 401 })
  }

  const token = await generateToken(utente.username, utente.profili)

  return Response.json({
    token,
    utente: {
      id: utente.id,
      username: utente.username,
      nome: utente.nome,
      cognome: utente.cognome,
      profili: utente.profili,
    },
  })
}
