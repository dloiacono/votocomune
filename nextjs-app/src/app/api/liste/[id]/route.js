import prisma from '@/lib/db'
import { getAuthUser, hasRole } from '@/lib/auth'

export async function GET(request, { params }) {
  const authUser = await getAuthUser(request)
  if (!authUser) return Response.json({ error: 'Non autorizzato' }, { status: 401 })

  const { id } = await params
  const lista = await prisma.listaElettorale.findUnique({ where: { id: parseInt(id) } })
  if (!lista) return Response.json({ error: 'Lista non trovata' }, { status: 404 })

  return Response.json(lista)
}

export async function PUT(request, { params }) {
  const authUser = await getAuthUser(request)
  if (!authUser || !hasRole(authUser, 'ADMIN', 'GESTORE_LISTE')) {
    return Response.json({ error: 'Non autorizzato' }, { status: 403 })
  }

  const { id } = await params
  const body = await request.json()

  if (body.numero != null) {
    const existing = await prisma.listaElettorale.findFirst({
      where: { numero: parseInt(body.numero), NOT: { id: parseInt(id) } },
    })
    if (existing) return Response.json({ error: 'Numero lista già esistente' }, { status: 400 })
  }

  const data = {}
  if (body.numero != null) data.numero = parseInt(body.numero)
  if (body.nome != null) data.nome = body.nome
  if (body.simbolo != null) data.simbolo = body.simbolo
  if (body.colore != null) data.colore = body.colore

  const lista = await prisma.listaElettorale.update({ where: { id: parseInt(id) }, data })
  return Response.json(lista)
}

export async function DELETE(request, { params }) {
  const authUser = await getAuthUser(request)
  if (!authUser || !hasRole(authUser, 'ADMIN', 'GESTORE_LISTE')) {
    return Response.json({ error: 'Non autorizzato' }, { status: 403 })
  }

  const { id } = await params
  await prisma.listaElettorale.delete({ where: { id: parseInt(id) } })
  return new Response(null, { status: 204 })
}
