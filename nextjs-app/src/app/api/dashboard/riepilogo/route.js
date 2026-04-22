import prisma from '@/lib/db'
import { getAuthUser } from '@/lib/auth'

export async function GET(request) {
  const authUser = await getAuthUser(request)
  if (!authUser) return Response.json({ error: 'Non autorizzato' }, { status: 401 })

  const sezioni = await prisma.sezione.findMany()
  const sezioniScrutinate = sezioni.filter(s => s.scrutinata).length

  // Get distinct votanti per sezione (avoid counting duplicates across lists)
  const votiPerSezione = await prisma.votoSezione.groupBy({
    by: ['sezioneId'],
    _max: { votanti: true, schedeBianche: true, schedeNulle: true },
  })

  const votantiTotali = votiPerSezione.reduce((sum, v) => sum + (v._max.votanti || 0), 0)
  const schedeBiancheTotali = votiPerSezione.reduce((sum, v) => sum + (v._max.schedeBianche || 0), 0)
  const schedeNulleTotali = votiPerSezione.reduce((sum, v) => sum + (v._max.schedeNulle || 0), 0)
  const aventiDirittoTotali = sezioni.reduce((sum, s) => sum + s.aventiDiritto, 0)

  return Response.json({
    sezioniTotali: sezioni.length,
    sezioniScrutinate,
    votantiTotali,
    aventiDirittoTotali,
    schedeBiancheTotali,
    schedeNulleTotali,
  })
}
