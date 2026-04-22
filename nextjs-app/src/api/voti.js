import client from './client'

export async function getVotiSezione(sezioneId) { return client.get(`/voti/sezione/${sezioneId}`) }
export async function saveVotiSezione(data) { return client.post('/voti/sezione', data) }
export async function getVotiStato() { return client.get('/voti/stato') }
