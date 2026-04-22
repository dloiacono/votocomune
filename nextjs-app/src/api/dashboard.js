import client from './client'

export async function getRiepilogo() { return client.get('/dashboard/riepilogo') }
export async function getSindaciDashboard() { return client.get('/dashboard/sindaci') }
export async function getListeDashboard() { return client.get('/dashboard/liste') }
export async function getSezioniDashboard() { return client.get('/dashboard/sezioni') }
export async function getConsiglieridashboard() { return client.get('/dashboard/consiglieri') }
