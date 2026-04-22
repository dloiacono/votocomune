import prisma from '@/lib/db'
import { getAuthUser } from '@/lib/auth'

export async function GET(request) {
  const authUser = await getAuthUser(request)
  if (!authUser) return Response.json({ error: 'Non autorizzato' }, { status: 401 })

  const sezioni = await prisma.sezione.findMany({ orderBy: { numero: 'asc' } })

  const votiPerSezione = await prisma.votoSezione.groupBy({
    by: ['sezioneId'],
    _max: { votanti: true },
  })
  const votantiMap = Object.fromEntries(
    votiPerSezione.map(v => [v.sezioneId, v._max.votanti || 0])
  )

  return Response.json(
    sezioni.map(s => ({
      sezioneId: s.id,
      numero: s.numero,
      nome: s.nome,
      scrutinata: s.scrutinata,
      votanti: votantiMap[s.id] || 0,
      aventiDiritto: s.aventiDiritto,
    }))
  )
}
