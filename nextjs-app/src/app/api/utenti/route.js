import prisma from '@/lib/db'
import { getAuthUser, hasRole, hashPassword } from '@/lib/auth'

export async function GET(request) {
  const authUser = await getAuthUser(request)
  if (!authUser || !hasRole(authUser, 'ADMIN')) {
    return Response.json({ error: 'Non autorizzato' }, { status: 403 })
  }

  const utenti = await prisma.utente.findMany({
    select: { id: true, username: true, nome: true, cognome: true, email: true, profili: true },
  })
  return Response.json(utenti)
}

export async function POST(request) {
  const authUser = await getAuthUser(request)
  if (!authUser || !hasRole(authUser, 'ADMIN')) {
    return Response.json({ error: 'Non autorizzato' }, { status: 403 })
  }

  const body = await request.json()
  if (!body.username || !body.password || !body.nome || !body.cognome || !body.email) {
    return Response.json({ error: 'Tutti i campi sono obbligatori' }, { status: 400 })
  }

  const existing = await prisma.utente.findUnique({ where: { username: body.username } })
  if (existing) return Response.json({ error: 'Username già esistente' }, { status: 400 })

  const passwordHash = await hashPassword(body.password)
  const utente = await prisma.utente.create({
    data: {
      username: body.username,
      passwordHash,
      nome: body.nome,
      cognome: body.cognome,
      email: body.email,
      profili: body.profili || [],
    },
    select: { id: true, username: true, nome: true, cognome: true, email: true, profili: true },
  })
  return Response.json(utente, { status: 201 })
}
