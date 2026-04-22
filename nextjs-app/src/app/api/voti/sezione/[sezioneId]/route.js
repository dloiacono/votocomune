import prisma from '@/lib/db'
import { getAuthUser } from '@/lib/auth'

export async function GET(request, { params }) {
  const authUser = await getAuthUser(request)
  if (!authUser) return Response.json({ error: 'Non autorizzato' }, { status: 401 })

  const { sezioneId } = await params
  const id = parseInt(sezioneId)

  const sezione = await prisma.sezione.findUnique({ where: { id } })
  if (!sezione) return Response.json({ error: 'Sezione non trovata' }, { status: 404 })

  const voti = await prisma.votoSezione.findMany({
    where: { sezioneId: id },
    include: { lista: true },
  })

  const preferenze = await prisma.preferenzaConsigliere.findMany({
    where: { sezioneId: id },
    include: { consigliere: { include: { lista: true } } },
  })

  // Build response matching what the frontend expects
  const firstVoto = voti[0]
  const listeVoti = {}
  const sindaciVoti = {}
  for (const v of voti) {
    listeVoti[String(v.listaId)] = v.votiLista
    sindaciVoti[String(v.listaId)] = v.votiSindaco
  }

  const consiglieriPreferenze = {}
  for (const p of preferenze) {
    consiglieriPreferenze[String(p.consigliereId)] = p.preferenze
  }

  return Response.json({
    sezioneId: id,
    votantiTotali: firstVoto?.votanti || 0,
    schedeBianche: firstVoto?.schedeBianche || 0,
    schedeNulle: firstVoto?.schedeNulle || 0,
    listeVoti,
    sindaciVoti,
    consiglieriPreferenze,
  })
}
