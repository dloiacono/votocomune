import prisma from '@/lib/db'
import { getAuthUser, hasRole } from '@/lib/auth'

export async function GET(request) {
  const authUser = await getAuthUser(request)
  if (!authUser) return Response.json({ error: 'Non autorizzato' }, { status: 401 })

  const liste = await prisma.listaElettorale.findMany({ orderBy: { numero: 'asc' } })
  return Response.json(liste)
}

export async function POST(request) {
  const authUser = await getAuthUser(request)
  if (!authUser || !hasRole(authUser, 'ADMIN', 'GESTORE_LISTE')) {
    return Response.json({ error: 'Non autorizzato' }, { status: 403 })
  }

  const body = await request.json()
  const { numero, nome, simbolo, colore } = body

  if (!numero || !nome || !simbolo || !colore) {
    return Response.json({ error: 'Tutti i campi sono obbligatori' }, { status: 400 })
  }

  const existing = await prisma.listaElettorale.findUnique({ where: { numero: parseInt(numero) } })
  if (existing) return Response.json({ error: 'Numero lista già esistente' }, { status: 400 })

  const lista = await prisma.listaElettorale.create({
    data: { numero: parseInt(numero), nome, simbolo, colore },
  })
  return Response.json(lista, { status: 201 })
}
