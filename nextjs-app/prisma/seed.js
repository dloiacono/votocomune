import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clean existing data
  await prisma.preferenzaConsigliere.deleteMany()
  await prisma.votoSezione.deleteMany()
  await prisma.candidatoConsigliere.deleteMany()
  await prisma.candidatoSindaco.deleteMany()
  await prisma.listaElettorale.deleteMany()
  await prisma.sezione.deleteMany()
  await prisma.utente.deleteMany()

  // Admin user
  const passwordHash = await bcrypt.hash('admin123', 12)
  await prisma.utente.create({
    data: {
      username: 'admin',
      passwordHash,
      nome: 'Amministratore',
      cognome: 'Sistema',
      email: 'admin@comunali.app',
      profili: ['ADMIN', 'GESTORE_CANDIDATI', 'GESTORE_LISTE', 'GESTORE_VOTI'],
    },
  })

  // 20 Sezioni
  const sezioniData = [
    { numero: 1, nome: 'Scuola Media Mazzini', aventiDiritto: 450 },
    { numero: 2, nome: 'Scuola Primaria Garibaldi', aventiDiritto: 480 },
    { numero: 3, nome: 'Liceo Scientifico Da Vinci', aventiDiritto: 520 },
    { numero: 4, nome: 'Palestra Comunale', aventiDiritto: 410 },
    { numero: 5, nome: 'Centro Ricreativo', aventiDiritto: 470 },
    { numero: 6, nome: 'Auditorium Civico', aventiDiritto: 500 },
    { numero: 7, nome: 'Biblioteca Comunale', aventiDiritto: 430 },
    { numero: 8, nome: 'Chiesa Parrocchiale', aventiDiritto: 460 },
    { numero: 9, nome: "Scuola dell'Infanzia", aventiDiritto: 400 },
    { numero: 10, nome: 'Circolo Ricreativo', aventiDiritto: 490 },
    { numero: 11, nome: 'Caserma Vigili Fuoco', aventiDiritto: 420 },
    { numero: 12, nome: 'Ospedale Civile', aventiDiritto: 510 },
    { numero: 13, nome: 'Centro Anziani', aventiDiritto: 380 },
    { numero: 14, nome: 'Parco Pubblico', aventiDiritto: 550 },
    { numero: 15, nome: 'Stazione Ferroviaria', aventiDiritto: 440 },
    { numero: 16, nome: 'Mercato Coperto', aventiDiritto: 470 },
    { numero: 17, nome: 'Museo Civico', aventiDiritto: 390 },
    { numero: 18, nome: 'Teatro Comunale', aventiDiritto: 530 },
    { numero: 19, nome: 'Piscina Comunale', aventiDiritto: 450 },
    { numero: 20, nome: 'Palazzetto dello Sport', aventiDiritto: 480 },
  ]
  await prisma.sezione.createMany({ data: sezioniData })

  // 3 Liste Elettorali
  const listaA = await prisma.listaElettorale.create({
    data: { numero: 1, nome: 'Lista A - Centro Sinistra', simbolo: 'Rosa', colore: '#FF69B4' },
  })
  const listaB = await prisma.listaElettorale.create({
    data: { numero: 2, nome: 'Lista B - Centro Destra', simbolo: 'Sole', colore: '#FFD700' },
  })
  const listaC = await prisma.listaElettorale.create({
    data: { numero: 3, nome: 'Lista C - Sinistra', simbolo: 'Stella', colore: '#FF0000' },
  })

  // 2 Candidati Sindaco
  await prisma.candidatoSindaco.create({
    data: {
      nome: 'Marco',
      cognome: 'Rossi',
      liste: { connect: [{ id: listaA.id }, { id: listaB.id }] },
    },
  })
  await prisma.candidatoSindaco.create({
    data: {
      nome: 'Anna',
      cognome: 'Bianchi',
      liste: { connect: [{ id: listaC.id }] },
    },
  })

  // 15 Candidati Consigliere (5 per lista)
  const consiglieriData = [
    // Lista A
    { nome: 'Paolo', cognome: 'Ferrari', listaId: listaA.id, ordineLista: 1 },
    { nome: 'Laura', cognome: 'Rossi', listaId: listaA.id, ordineLista: 2 },
    { nome: 'Giovanni', cognome: 'Verdi', listaId: listaA.id, ordineLista: 3 },
    { nome: 'Maria', cognome: 'Neri', listaId: listaA.id, ordineLista: 4 },
    { nome: 'Antonio', cognome: 'Marrone', listaId: listaA.id, ordineLista: 5 },
    // Lista B
    { nome: 'Francesca', cognome: 'Giallo', listaId: listaB.id, ordineLista: 1 },
    { nome: 'Carlo', cognome: 'Blu', listaId: listaB.id, ordineLista: 2 },
    { nome: 'Elena', cognome: 'Arancio', listaId: listaB.id, ordineLista: 3 },
    { nome: 'Michele', cognome: 'Viola', listaId: listaB.id, ordineLista: 4 },
    { nome: 'Giulia', cognome: 'Indaco', listaId: listaB.id, ordineLista: 5 },
    // Lista C
    { nome: 'Davide', cognome: 'Cremisi', listaId: listaC.id, ordineLista: 1 },
    { nome: 'Silvia', cognome: 'Scarlatto', listaId: listaC.id, ordineLista: 2 },
    { nome: 'Roberto', cognome: 'Bordo', listaId: listaC.id, ordineLista: 3 },
    { nome: 'Alessandra', cognome: 'Magenta', listaId: listaC.id, ordineLista: 4 },
    { nome: 'Luca', cognome: 'Turchese', listaId: listaC.id, ordineLista: 5 },
  ]
  await prisma.candidatoConsigliere.createMany({ data: consiglieriData })

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
