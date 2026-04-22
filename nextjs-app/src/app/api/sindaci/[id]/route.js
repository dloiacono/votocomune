import prisma from '@/lib/db'
import { getAuthUser, hasRole } from '@/lib/auth'

export async function GET(request, { params }) {
  const authUser = await getAuthUser(request)
  if (!authUser) return Response.json({ error: 'Non autorizzato' }, { status: 401 })

  const { id } = await params
  const sindaco = await prisma.candidatoSindaco.findUnique({
    where: { id: parseInt(id) },
    include: { liste: true },
  })
  if (!sindaco) return Response.json({ error: 'Candidato non trovato' }, { status: 404 })

  return Response.json(sindaco)
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
  if (body.foto !== undefined) data.foto = body.foto || null

  if (body.liste || body.listeIds) {
    const ids = (body.liste || body.listeIds).map(lid => ({ id: parseInt(lid) }))
    data.liste = { set: ids }
  }

  const sindaco = await prisma.candidatoSindaco.update({
    where: { id: parseInt(id) },
    data,
    include: { liste: true },
  })
  return Response.json(sindaco)
}

export async function DELETE(request, { params }) {
  const authUser = await getAuthUser(request)
  if (!authUser || !hasRole(authUser, 'ADMIN', 'GESTORE_CANDIDATI')) {
    return Response.json({ error: 'Non autorizzato' }, { status: 403 })
  }

  const { id } = await params
  await prisma.candidatoSindaco.delete({ where: { id: parseInt(id) } })
  return new Response(null, { status: 204 })
}
