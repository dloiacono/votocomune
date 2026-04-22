const API_BASE = '/api'

async function request(method, path, data) {
  const token = localStorage.getItem('comunali_token')
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  }
  if (token) options.headers.Authorization = `Bearer ${token}`
  if (data) options.body = JSON.stringify(data)

  const response = await fetch(`${API_BASE}${path}`, options)

  if (response.status === 401 && !window.location.pathname.startsWith('/login')) {
    localStorage.removeItem('comunali_token')
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }

  if (response.status === 204) return null

  const json = await response.json()
  if (!response.ok) {
    const error = new Error(json.error || json.message || 'Request failed')
    error.response = { status: response.status, data: json }
    throw error
  }
  return json
}

const client = {
  get: (path) => request('GET', path),
  post: (path, data) => request('POST', path, data),
  put: (path, data) => request('PUT', path, data),
  delete: (path) => request('DELETE', path),
}

export default client
