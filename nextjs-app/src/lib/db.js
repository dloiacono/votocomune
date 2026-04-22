import { PrismaClient } from '@prisma/client'
import { PrismaNeonHttp } from '@prisma/adapter-neon'

function createClient() {
  const adapter = new PrismaNeonHttp(process.env.DATABASE_URL)
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis
const prisma = globalForPrisma._prismaV3 ?? createClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma._prismaV3 = prisma

export default prisma
