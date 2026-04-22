import prisma from '@/lib/db'
import { getAuthUser } from '@/lib/auth'

export async function GET(request) {
  const authUser = await getAuthUser(request)
  if (!authUser) return Response.json({ error: 'Non autorizzato' }, { status: 401 })

  const sindaci = await prisma.candidatoSindaco.findMany({ include: { liste: true } })
  const voti = await prisma.votoSezione.findMany()

  // Calculate total expressed votes (sum of all votiSindaco)
  const votiTotaliEspressi = voti.reduce((sum, v) => sum + v.votiSindaco, 0)

  const risultati = sindaci.map(sindaco => {
    const listeIds = sindaco.liste.map(l => l.id)
    const votiSindaco = voti
      .filter(v => listeIds.includes(v.listaId))
      .reduce((sum, v) => sum + v.votiSindaco, 0)

    const listeRisultati = sindaco.liste.map(lista => {
      const votiLista = voti
        .filter(v => v.listaId === lista.id)
        .reduce((sum, v) => sum + v.votiLista, 0)
      return { listaId: lista.id, nome: lista.nome, votiLista }
    })

    return {
      sindacoId: sindaco.id,
      nome: sindaco.nome,
      cognome: sindaco.cognome,
      votiTotali: votiSindaco,
      percentuale: votiTotaliEspressi > 0 ? Math.round((votiSindaco / votiTotaliEspressi) * 10000) / 100 : 0,
      liste: listeRisultati,
    }
  })

  risultati.sort((a, b) => b.votiTotali - a.votiTotali)
  return Response.json(risultati)
}
