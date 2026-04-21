import client from './client'

export async function getSezioni() {
  const response = await client.get('/sezioni')
  return response.data
}

export async function createSezione(data) {
  const response = await client.post('/sezioni', data)
  return response.data
}

export async function updateSezione(id, data) {
  const response = await client.put(`/sezioni/${id}`, data)
  return response.data
}

export async function deleteSezione(id) {
  const response = await client.delete(`/sezioni/${id}`)
  return response.data
}
