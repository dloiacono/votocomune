import prisma from '@/lib/db'
import { getAuthUser, hasRole } from '@/lib/auth'

export async function GET(request) {
  const authUser = await getAuthUser(request)
  if (!authUser) return Response.json({ error: 'Non autorizzato' }, { status: 401 })

  const sindaci = await prisma.candidatoSindaco.findMany({
    include: { liste: true },
  })
  return Response.json(sindaci)
}

export async function POST(request) {
  const authUser = await getAuthUser(request)
  if (!authUser || !hasRole(authUser, 'ADMIN', 'GESTORE_CANDIDATI')) {
    return Response.json({ error: 'Non autorizzato' }, { status: 403 })
  }

  const body = await request.json()
  if (!body.nome || !body.cognome) {
    return Response.json({ error: 'Nome e cognome sono obbligatori' }, { status: 400 })
  }

  const listeConnect = (body.liste || body.listeIds || []).map(id => ({ id: parseInt(id) }))

  const sindaco = await prisma.candidatoSindaco.create({
    data: {
      nome: body.nome,
      cognome: body.cognome,
      foto: body.foto || null,
      liste: { connect: listeConnect },
    },
    include: { liste: true },
  })
  return Response.json(sindaco, { status: 201 })
}
