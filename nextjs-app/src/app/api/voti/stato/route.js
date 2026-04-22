import prisma from '@/lib/db'
import { getAuthUser } from '@/lib/auth'

export async function GET(request) {
  const authUser = await getAuthUser(request)
  if (!authUser) return Response.json({ error: 'Non autorizzato' }, { status: 401 })

  const sezioni = await prisma.sezione.findMany({
    select: { id: true, numero: true, nome: true, scrutinata: true },
    orderBy: { numero: 'asc' },
  })

  return Response.json(
    sezioni.map(s => ({
      sezioneId: s.id,
      numero: s.numero,
      nome: s.nome,
      scrutinata: s.scrutinata,
    }))
  )
}
