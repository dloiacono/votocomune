import prisma from '@/lib/db'
import { getAuthUser, hasRole } from '@/lib/auth'

export async function GET(request, { params }) {
  const authUser = await getAuthUser(request)
  if (!authUser) return Response.json({ error: 'Non autorizzato' }, { status: 401 })

  const { id } = await params
  const consigliere = await prisma.candidatoConsigliere.findUnique({
    where: { id: parseInt(id) },
    include: { lista: true },
  })
  if (!consigliere) return Response.json({ error: 'Candidato non trovato' }, { status: 404 })

  return Response.json(consigliere)
}

export async function PUT(request, { params }) {
  const authUser = await getAuthUser(request)
  if (!authUser || !hasRole(authUser, 'ADMIN', 'GESTORE_CANDIDATI')) {
    return Response.json({ error: 'Non autorizzato' }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()

  const data = {}
  if (body.nome) data.nome = body.nome
  if (body.cognome) data.cognome = body.cognome
  if (body.listaId) data.listaId = parseInt(body.listaId)
  if (body.ordineLista) data.ordineLista = parseInt(body.ordineLista)

  const consigliere = await prisma.candidatoConsigliere.update({
    where: { id: parseInt(id) },
    data,
    include: { lista: true },
  })
  return Response.json(consigliere)
}

export async function DELETE(request, { params }) {
  const authUser = await getAuthUser(request)
  if (!authUser || !hasRole(authUser, 'ADMIN', 'GESTORE_CANDIDATI')) {
    return Response.json({ error: 'Non autorizzato' }, { status: 403 })
  }

  const { id } = await params
  await prisma.candidatoConsigliere.delete({ where: { id: parseInt(id) } })
  return new Response(null, { status: 204 })
}
