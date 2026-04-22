import client from './client'

export async function getSindaci() { return client.get('/sindaci') }
export async function createSindaco(data) { return client.post('/sindaci', data) }
export async function updateSindaco(id, data) { return client.put(`/sindaci/${id}`, data) }
export async function deleteSindaco(id) { return client.delete(`/sindaci/${id}`) }

export async function getConsiglieri(listaId) {
  const query = listaId ? `?listaId=${listaId}` : ''
  return client.get(`/consiglieri${query}`)
}
export async function createConsigliere(data) { return client.post('/consiglieri', data) }
export async function updateConsigliere(id, data) { return client.put(`/consiglieri/${id}`, data) }
export async function deleteConsigliere(id) { return client.delete(`/consiglieri/${id}`) }
