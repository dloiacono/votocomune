import client from './client'

export async function getListe() { return client.get('/liste') }
export async function createLista(data) { return client.post('/liste', data) }
export async function updateLista(id, data) { return client.put(`/liste/${id}`, data) }
export async function deleteLista(id) { return client.delete(`/liste/${id}`) }
