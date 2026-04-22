import prisma from '@/lib/db'
import { getAuthUser } from '@/lib/auth'

export async function GET(request) {
  const authUser = await getAuthUser(request)
  if (!authUser) return Response.json({ error: 'Non autorizzato' }, { status: 401 })

  const consiglieri = await prisma.candidatoConsigliere.findMany({
    include: { lista: true },
  })

  const preferenze = await prisma.preferenzaConsigliere.groupBy({
    by: ['consigliereId'],
    _sum: { preferenze: true },
  })
  const prefMap = Object.fromEntries(
    preferenze.map(p => [p.consigliereId, p._sum.preferenze || 0])
  )

  const risultati = consiglieri.map(c => ({
    consigliereId: c.id,
    nome: c.nome,
    cognome: c.cognome,
    lista: { id: c.lista.id, nome: c.lista.nome, colore: c.lista.colore },
    preferenzeTotali: prefMap[c.id] || 0,
  }))

  risultati.sort((a, b) => b.preferenzeTotali - a.preferenzeTotali)
  return Response.json(risultati)
}
