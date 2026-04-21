import { render, screen, waitFor, act } from '@testing-library/react'
import { useContext } from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthContext, AuthProvider } from '../AuthContext'

vi.mock('../../api/auth', () => ({
  login: vi.fn(),
  getCurrentUser: vi.fn(),
}))

import * as authApi from '../../api/auth'

function TestConsumer() {
  const auth = useContext(AuthContext)
  return (
    <div>
      <span data-testid="authenticated">{String(auth.isAuthenticated)}</span>
      <span data-testid="loading">{String(auth.loading)}</span>
      <span data-testid="user">{auth.user ? auth.user.username : 'null'}</span>
      <span data-testid="error">{auth.error || 'null'}</span>
      <button onClick={() => auth.login('admin', 'pass')}>Login</button>
      <button onClick={auth.logout}>Logout</button>
      <span data-testid="hasAdmin">{String(auth.hasProfile('ADMIN'))}</span>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('initializes as unauthenticated when no token', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })

    expect(screen.getByTestId('authenticated').textContent).toBe('false')
    expect(screen.getByTestId('user').textContent).toBe('null')
  })

  it('fetches user when token exists in localStorage', async () => {
    localStorage.setItem('comunali_token', 'test-token')
    authApi.getCurrentUser.mockResolvedValue({
      username: 'admin',
      profili: ['ADMIN'],
    })

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('admin')
    })

    expect(screen.getByTestId('authenticated').textContent).toBe('true')
  })

  it('clears token on failed user fetch', async () => {
    localStorage.setItem('comunali_token', 'expired-token')
    authApi.getCurrentUser.mockRejectedValue(new Error('401'))

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })

    expect(screen.getByTestId('authenticated').textContent).toBe('false')
    expect(screen.getByTestId('error').textContent).toBe('Sessione scaduta')
    expect(localStorage.getItem('comunali_token')).toBeNull()
  })

  it('hasProfile returns false when user is null', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })

    expect(screen.getByTestId('hasAdmin').textContent).toBe('false')
  })
})
