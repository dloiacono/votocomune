import client from './client'

export async function login(username, password) {
  return client.post('/auth/login', { username, password })
}

export async function getCurrentUser() {
  return client.get('/auth/me')
}
