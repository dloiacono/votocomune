import client from './client'

export async function getVotiSezione(sezioneId) {
  const response = await client.get(`/voti/sezione/${sezioneId}`)
  return response.data
}

export async function saveVotiSezione(data) {
  const response = await client.post('/voti/sezione', data)
  return response.data
}

export async function getVotiStato() {
  const response = await client.get('/voti/stato')
  return response.data
}
