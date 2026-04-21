import client from './client'

export async function getSindaci() {
  const response = await client.get('/sindaci')
  return response.data
}

export async function createSindaco(data) {
  const response = await client.post('/sindaci', data)
  return response.data
}

export async function updateSindaco(id, data) {
  const response = await client.put(`/sindaci/${id}`, data)
  return response.data
}

export async function deleteSindaco(id) {
  const response = await client.delete(`/sindaci/${id}`)
  return response.data
}

export async function getConsiglieri(listaId = null) {
  const params = listaId ? { listaId } : {}
  const response = await client.get('/consiglieri', { params })
  return response.data
}

export async function createConsigliere(data) {
  const response = await client.post('/consiglieri', data)
  return response.data
}

export async function updateConsigliere(id, data) {
  const response = await client.put(`/consiglieri/${id}`, data)
  return response.data
}

export async function deleteConsigliere(id) {
  const response = await client.delete(`/consiglieri/${id}`)
  return response.data
}
