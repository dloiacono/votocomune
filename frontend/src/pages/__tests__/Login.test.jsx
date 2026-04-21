import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import Login from '../Login'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderLogin(authOverrides = {}) {
  const authValue = {
    login: vi.fn(),
    loading: false,
    error: null,
    ...authOverrides,
  }

  return {
    ...render(
      <MemoryRouter>
        <AuthContext.Provider value={authValue}>
          <Login />
        </AuthContext.Provider>
      </MemoryRouter>
    ),
    authValue,
  }
}

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form', () => {
    renderLogin()
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
  })

  it('calls login on form submission', async () => {
    const login = vi.fn().mockResolvedValue({})
    renderLogin({ login })

    await userEvent.type(screen.getByPlaceholderText(/username/i), 'admin')
    await userEvent.type(screen.getByPlaceholderText(/password/i), 'admin123')
    await userEvent.click(screen.getByRole('button', { name: /accedi/i }))

    expect(login).toHaveBeenCalledWith('admin', 'admin123')
  })

  it('navigates to dashboard on successful login', async () => {
    const login = vi.fn().mockResolvedValue({})
    renderLogin({ login })

    await userEvent.type(screen.getByPlaceholderText(/username/i), 'admin')
    await userEvent.type(screen.getByPlaceholderText(/password/i), 'pass')
    await userEvent.click(screen.getByRole('button', { name: /accedi/i }))

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('shows error on failed login', async () => {
    const error = new Error('Login failed')
    error.response = { data: { message: 'Credenziali non valide' } }
    const login = vi.fn().mockRejectedValue(error)
    renderLogin({ login })

    await userEvent.type(screen.getByPlaceholderText(/username/i), 'wrong')
    await userEvent.type(screen.getByPlaceholderText(/password/i), 'wrong')
    await userEvent.click(screen.getByRole('button', { name: /accedi/i }))

    await waitFor(() => {
      expect(screen.getByText('Credenziali non valide')).toBeInTheDocument()
    })
  })
})
