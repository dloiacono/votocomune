import client from './client'

export async function login(username, password) {
  const response = await client.post('/auth/login', { username, password })
  return response.data
}

export async function getCurrentUser(token) {
  const response = await client.get('/auth/me')
  return response.data
}
