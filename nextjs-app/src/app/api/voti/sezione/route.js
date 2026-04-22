import prisma from '@/lib/db'
import { getAuthUser, hasRole } from '@/lib/auth'

export async function POST(request) {
  const authUser = await getAuthUser(request)
  if (!authUser || !hasRole(authUser, 'ADMIN', 'GESTORE_VOTI')) {
    return Response.json({ error: 'Non autorizzato' }, { status: 403 })
  }

  const body = await request.json()
  if (!body.sezioneId) {
    return Response.json({ error: 'sezioneId è obbligatorio' }, { status: 400 })
  }

  const sezione = await prisma.sezione.findUnique({ where: { id: parseInt(body.sezioneId) } })
  if (!sezione) return Response.json({ error: 'Sezione non trovata' }, { status: 404 })

  const votanti = parseInt(body.votanti || body.votantiTotali || 0)
  const schedeBianche = parseInt(body.schedeBianche || 0)
  const schedeNulle = parseInt(body.schedeNulle || 0)

  // Save list votes
  const votiListe = body.votiListe || []
  // Handle both array format and map format from frontend
  if (Array.isArray(votiListe)) {
    for (const voto of votiListe) {
      const listaId = parseInt(voto.listaId)
      const lista = await prisma.listaElettorale.findUnique({ where: { id: listaId } })
      if (!lista) continue

      await prisma.votoSezione.upsert({
        where: { sezioneId_listaId: { sezioneId: sezione.id, listaId } },
        create: {
          sezioneId: sezione.id,
          listaId,
          votiLista: parseInt(voto.votiLista || 0),
          votiSindaco: parseInt(voto.votiSindaco || 0),
          votanti,
          schedeBianche,
          schedeNulle,
        },
        update: {
          votiLista: parseInt(voto.votiLista || 0),
          votiSindaco: parseInt(voto.votiSindaco || 0),
          votanti,
          schedeBianche,
          schedeNulle,
        },
      })
    }
  } else if (body.listeVoti) {
    // Map format: { listaId: votiCount }
    const listeVoti = body.listeVoti
    const sindaciVoti = body.sindaciVoti || {}
    const liste = await prisma.listaElettorale.findMany()

    for (const lista of liste) {
      const listaIdStr = String(lista.id)
      await prisma.votoSezione.upsert({
        where: { sezioneId_listaId: { sezioneId: sezione.id, listaId: lista.id } },
        create: {
          sezioneId: sezione.id,
          listaId: lista.id,
          votiLista: parseInt(listeVoti[listaIdStr] || 0),
          votiSindaco: parseInt(sindaciVoti[listaIdStr] || 0),
          votanti,
          schedeBianche,
          schedeNulle,
        },
        update: {
          votiLista: parseInt(listeVoti[listaIdStr] || 0),
          votiSindaco: parseInt(sindaciVoti[listaIdStr] || 0),
          votanti,
          schedeBianche,
          schedeNulle,
        },
      })
    }
  }

  // Save consigliere preferences
  const preferenze = body.preferenzeConsiglieri || {}
  if (Array.isArray(preferenze)) {
    for (const pref of preferenze) {
      const consigliereId = parseInt(pref.consigliereId)
      await prisma.preferenzaConsigliere.upsert({
        where: { sezioneId_consigliereId: { sezioneId: sezione.id, consigliereId } },
        create: { sezioneId: sezione.id, consigliereId, preferenze: parseInt(pref.preferenze || 0) },
        update: { preferenze: parseInt(pref.preferenze || 0) },
      })
    }
  } else {
    // Map format: { consigliereId: count }
    for (const [consIdStr, count] of Object.entries(preferenze)) {
      const consigliereId = parseInt(consIdStr)
      if (isNaN(consigliereId)) continue
      await prisma.preferenzaConsigliere.upsert({
        where: { sezioneId_consigliereId: { sezioneId: sezione.id, consigliereId } },
        create: { sezioneId: sezione.id, consigliereId, preferenze: parseInt(count || 0) },
        update: { preferenze: parseInt(count || 0) },
      })
    }
  }

  // Mark section as scrutinized
  await prisma.sezione.update({ where: { id: sezione.id }, data: { scrutinata: true } })

  return Response.json({ message: 'Voti salvati correttamente' })
}
