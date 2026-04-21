import client from './client'

export async function getListe() {
  const response = await client.get('/liste')
  return response.data
}

export async function createLista(data) {
  const response = await client.post('/liste', data)
  return response.data
}

export async function updateLista(id, data) {
  const response = await client.put(`/liste/${id}`, data)
  return response.data
}

export async function deleteLista(id) {
  const response = await client.delete(`/liste/${id}`)
  return response.data
}
