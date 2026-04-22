'use client'
import { createContext, useState, useCallback, useEffect } from 'react'
import * as authApi from '../api/auth'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCurrentUser = useCallback(async () => {
    try {
      const userData = await authApi.getCurrentUser()
      setUser(userData)
    } catch (err) {
      localStorage.removeItem('comunali_token')
      setToken(null)
      setUser(null)
      if (err.response?.status === 401) {
        setError('Sessione scaduta')
      }
    }
  }, [])

  useEffect(() => {
    const savedToken = localStorage.getItem('comunali_token')
    if (savedToken) {
      setToken(savedToken)
      fetchCurrentUser().finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [fetchCurrentUser])

  const login = useCallback(async (username, password) => {
    const response = await authApi.login(username, password)
    const { token: newToken, utente } = response
    localStorage.setItem('comunali_token', newToken)
    setToken(newToken)
    setUser(utente)
    setError(null)
    return response
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('comunali_token')
    setToken(null)
    setUser(null)
  }, [])

  const hasProfile = useCallback((profileName) => {
    return user?.profili?.includes(profileName) || false
  }, [user])

  const hasAnyProfile = useCallback((profileNames) => {
    return profileNames.some(p => user?.profili?.includes(p)) || false
  }, [user])

  const isAuthenticated = !!token && !!user

  return (
    <AuthContext.Provider value={{
      user, token, loading, error,
      login, logout,
      hasProfile, hasAnyProfile,
      isAuthenticated,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
