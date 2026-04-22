import prisma from '@/lib/db'
import { getAuthUser } from '@/lib/auth'

export async function GET(request) {
  const authUser = await getAuthUser(request)
  if (!authUser) return Response.json({ error: 'Non autorizzato' }, { status: 401 })

  const utente = await prisma.utente.findUnique({ where: { username: authUser.username } })
  if (!utente) return Response.json({ error: 'Utente non trovato' }, { status: 404 })

  return Response.json({
    id: utente.id,
    username: utente.username,
    nome: utente.nome,
    cognome: utente.cognome,
    profili: utente.profili,
  })
}
