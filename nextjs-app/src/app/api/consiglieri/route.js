import prisma from '@/lib/db'
import { getAuthUser, hasRole } from '@/lib/auth'

export async function GET(request) {
  const authUser = await getAuthUser(request)
  if (!authUser) return Response.json({ error: 'Non autorizzato' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const listaId = searchParams.get('listaId')

  const where = listaId ? { listaId: parseInt(listaId) } : {}

  const consiglieri = await prisma.candidatoConsigliere.findMany({
    where,
    include: { lista: true },
    orderBy: [{ listaId: 'asc' }, { ordineLista: 'asc' }],
  })
  return Response.json(consiglieri)
}

export async function POST(request) {
  const authUser = await getAuthUser(request)
  if (!authUser || !hasRole(authUser, 'ADMIN', 'GESTORE_CANDIDATI')) {
    return Response.json({ error: 'Non autorizzato' }, { status: 403 })
  }

  const body = await request.json()
  if (!body.nome || !body.cognome || !body.listaId || !body.ordineLista) {
    return Response.json({ error: 'Tutti i campi sono obbligatori' }, { status: 400 })
  }

  const lista = await prisma.listaElettorale.findUnique({ where: { id: parseInt(body.listaId) } })
  if (!lista) return Response.json({ error: 'Lista non trovata' }, { status: 404 })

  const consigliere = await prisma.candidatoConsigliere.create({
    data: {
      nome: body.nome,
      cognome: body.cognome,
      listaId: parseInt(body.listaId),
      ordineLista: parseInt(body.ordineLista),
    },
    include: { lista: true },
  })
  return Response.json(consigliere, { status: 201 })
}
