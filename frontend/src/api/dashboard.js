import client from './client'

export async function getRiepilogo() {
  const response = await client.get('/dashboard/riepilogo')
  return response.data
}

export async function getSindaciDashboard() {
  const response = await client.get('/dashboard/sindaci')
  return response.data
}

export async function getListeDashboard() {
  const response = await client.get('/dashboard/liste')
  return response.data
}

export async function getSezioniDashboard() {
  const response = await client.get('/dashboard/sezioni')
  return response.data
}

export async function getConsiglieridashboard() {
  const response = await client.get('/dashboard/consiglieri')
  return response.data
}
