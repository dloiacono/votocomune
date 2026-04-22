import client from './client'

export async function getUtenti() { return client.get('/utenti') }
export async function createUtente(data) { return client.post('/utenti', data) }
export async function updateUtente(id, data) { return client.put(`/utenti/${id}`, data) }
export async function deleteUtente(id) { return client.delete(`/utenti/${id}`) }
