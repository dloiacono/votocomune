import prisma from '@/lib/db'
import { getAuthUser, hasRole } from '@/lib/auth'

export async function GET(request, { params }) {
  const authUser = await getAuthUser(request)
  if (!authUser) return Response.json({ error: 'Non autorizzato' }, { status: 401 })

  const { id } = await params
  const sezione = await prisma.sezione.findUnique({ where: { id: parseInt(id) } })
  if (!sezione) return Response.json({ error: 'Sezione non trovata' }, { status: 404 })

  return Response.json(sezione)
}

export async function PUT(request, { params }) {
  const authUser = await getAuthUser(request)
  if (!authUser || !hasRole(authUser, 'ADMIN')) {
    return Response.json({ error: 'Non autorizzato' }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()

  if (body.numero != null) {
    const existing = await prisma.sezione.findFirst({
      where: { numero: parseInt(body.numero), NOT: { id: parseInt(id) } },
    })
    if (existing) return Response.json({ error: 'Numero sezione già esistente' }, { status: 400 })
  }

  const data = {}
  if (body.numero != null) data.numero = parseInt(body.numero)
  if (body.nome != null) data.nome = body.nome
  if (body.aventiDiritto != null) data.aventiDiritto = parseInt(body.aventiDiritto)
  if (body.scrutinata != null) data.scrutinata = body.scrutinata

  const sezione = await prisma.sezione.update({ where: { id: parseInt(id) }, data })
  return Response.json(sezione)
}

export async function DELETE(request, { params }) {
  const authUser = await getAuthUser(request)
  if (!authUser || !hasRole(authUser, 'ADMIN')) {
    return Response.json({ error: 'Non autorizzato' }, { status: 403 })
  }

  const { id } = await params
  await prisma.sezione.delete({ where: { id: parseInt(id) } })
  return new Response(null, { status: 204 })
}
