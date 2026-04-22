import prisma from '@/lib/db'
import { getAuthUser, hasRole, hashPassword } from '@/lib/auth'

export async function GET(request, { params }) {
  const authUser = await getAuthUser(request)
  if (!authUser || !hasRole(authUser, 'ADMIN')) {
    return Response.json({ error: 'Non autorizzato' }, { status: 403 })
  }

  const { id } = await params
  const utente = await prisma.utente.findUnique({
    where: { id: parseInt(id) },
    select: { id: true, username: true, nome: true, cognome: true, email: true, profili: true },
  })
  if (!utente) return Response.json({ error: 'Utente non trovato' }, { status: 404 })

  return Response.json(utente)
}

export async function PUT(request, { params }) {
  const authUser = await getAuthUser(request)
  if (!authUser || !hasRole(authUser, 'ADMIN')) {
    return Response.json({ error: 'Non autorizzato' }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()

  const data = {}
  if (body.nome) data.nome = body.nome
  if (body.cognome) data.cognome = body.cognome
  if (body.email) data.email = body.email
  if (body.profili) data.profili = body.profili
  if (body.password) data.passwordHash = await hashPassword(body.password)

  const utente = await prisma.utente.update({
    where: { id: parseInt(id) },
    data,
    select: { id: true, username: true, nome: true, cognome: true, email: true, profili: true },
  })
  return Response.json(utente)
}

export async function DELETE(request, { params }) {
  const authUser = await getAuthUser(request)
  if (!authUser || !hasRole(authUser, 'ADMIN')) {
    return Response.json({ error: 'Non autorizzato' }, { status: 403 })
  }

  const { id } = await params
  await prisma.utente.delete({ where: { id: parseInt(id) } })
  return new Response(null, { status: 204 })
}
