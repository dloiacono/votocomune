import client from './client'

export async function getSezioni() { return client.get('/sezioni') }
export async function createSezione(data) { return client.post('/sezioni', data) }
export async function updateSezione(id, data) { return client.put(`/sezioni/${id}`, data) }
export async function deleteSezione(id) { return client.delete(`/sezioni/${id}`) }
