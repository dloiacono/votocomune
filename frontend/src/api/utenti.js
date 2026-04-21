import client from './client'

export async function getUtenti() {
  const response = await client.get('/utenti')
  return response.data
}

export async function createUtente(data) {
  const response = await client.post('/utenti', data)
  return response.data
}

export async function updateUtente(id, data) {
  const response = await client.put(`/utenti/${id}`, data)
  return response.data
}

export async function deleteUtente(id) {
  const response = await client.delete(`/utenti/${id}`)
  return response.data
}
