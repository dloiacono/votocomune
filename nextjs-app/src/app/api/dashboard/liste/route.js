import prisma from '@/lib/db'
import { getAuthUser } from '@/lib/auth'

export async function GET(request) {
  const authUser = await getAuthUser(request)
  if (!authUser) return Response.json({ error: 'Non autorizzato' }, { status: 401 })

  const liste = await prisma.listaElettorale.findMany()
  const voti = await prisma.votoSezione.findMany()

  const votiTotaliEspressi = voti.reduce((sum, v) => sum + v.votiLista, 0)

  const risultati = liste.map(lista => {
    const votiTotali = voti
      .filter(v => v.listaId === lista.id)
      .reduce((sum, v) => sum + v.votiLista, 0)

    return {
      listaId: lista.id,
      numero: lista.numero,
      nome: lista.nome,
      colore: lista.colore,
      votiTotali,
      percentuale: votiTotaliEspressi > 0 ? Math.round((votiTotali / votiTotaliEspressi) * 10000) / 100 : 0,
    }
  })

  risultati.sort((a, b) => b.votiTotali - a.votiTotali)
  return Response.json(risultati)
}
