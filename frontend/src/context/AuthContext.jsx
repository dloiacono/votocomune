import { createContext, useState, useCallback, useEffect } from 'react'
import * as authApi from '../api/auth'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('comunali_token'))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (token) {
      fetchCurrentUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchCurrentUser = useCallback(async () => {
    try {
      setLoading(true)
      const userData = await authApi.getCurrentUser(token)
      setUser(userData)
      setError(null)
    } catch (err) {
      setToken(null)
      localStorage.removeItem('comunali_token')
      setUser(null)
      setError('Sessione scaduta')
    } finally {
      setLoading(false)
    }
  }, [token])

  const login = useCallback(async (username, password) => {
    try {
      setLoading(true)
      setError(null)
      const response = await authApi.login(username, password)
      const newToken = response.token
      setToken(newToken)
      localStorage.setItem('comunali_token', newToken)
      setUser(response.utente)
      return response
    } catch (err) {
      const message = err.response?.data?.message || 'Errore di login'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('comunali_token')
  }, [])

  const hasProfile = useCallback((profileName) => {
    if (!user) return false
    return user.profili && user.profili.includes(profileName)
  }, [user])

  const hasAnyProfile = useCallback((profileNames) => {
    if (!user) return false
    return profileNames.some(p => user.profili && user.profili.includes(p))
  }, [user])

  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    hasProfile,
    hasAnyProfile,
    isAuthenticated: !!token
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
