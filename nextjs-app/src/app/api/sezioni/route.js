import prisma from '@/lib/db'
import { getAuthUser, hasRole } from '@/lib/auth'

export async function GET(request) {
  const authUser = await getAuthUser(request)
  if (!authUser) return Response.json({ error: 'Non autorizzato' }, { status: 401 })

  const sezioni = await prisma.sezione.findMany({ orderBy: { numero: 'asc' } })
  return Response.json(sezioni)
}

export async function POST(request) {
  const authUser = await getAuthUser(request)
  if (!authUser || !hasRole(authUser, 'ADMIN')) {
    return Response.json({ error: 'Non autorizzato' }, { status: 403 })
  }

  const body = await request.json()
  const { numero, nome, aventiDiritto } = body

  if (!numero || !nome || aventiDiritto == null) {
    return Response.json({ error: 'Tutti i campi sono obbligatori' }, { status: 400 })
  }

  const existing = await prisma.sezione.findUnique({ where: { numero: parseInt(numero) } })
  if (existing) {
    return Response.json({ error: 'Numero sezione già esistente' }, { status: 400 })
  }

  const sezione = await prisma.sezione.create({
    data: { numero: parseInt(numero), nome, aventiDiritto: parseInt(aventiDiritto) },
  })
  return Response.json(sezione, { status: 201 })
}
