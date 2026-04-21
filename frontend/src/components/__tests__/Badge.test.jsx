import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Badge from '../Badge'

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>ADMIN</Badge>)
    expect(screen.getByText('ADMIN')).toBeInTheDocument()
  })

  it('applies default variant classes', () => {
    render(<Badge>Default</Badge>)
    const badge = screen.getByText('Default')
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-800')
  })

  it('applies success variant classes', () => {
    render(<Badge variant="success">OK</Badge>)
    const badge = screen.getByText('OK')
    expect(badge).toHaveClass('bg-green-100', 'text-green-800')
  })

  it('applies admin variant classes', () => {
    render(<Badge variant="admin">Admin</Badge>)
    const badge = screen.getByText('Admin')
    expect(badge).toHaveClass('bg-purple-100', 'text-purple-800')
  })

  it('uses custom color with inline style', () => {
    render(<Badge color="#FF0000">Custom</Badge>)
    const badge = screen.getByText('Custom')
    expect(badge).toHaveStyle({ backgroundColor: '#FF0000' })
    expect(badge).toHaveClass('text-white')
  })

  it('color prop takes precedence over variant', () => {
    render(<Badge variant="success" color="#0000FF">Priority</Badge>)
    const badge = screen.getByText('Priority')
    expect(badge).toHaveStyle({ backgroundColor: '#0000FF' })
  })

  it('falls back to default for unknown variant', () => {
    render(<Badge variant="nonexistent">Fallback</Badge>)
    const badge = screen.getByText('Fallback')
    expect(badge).toHaveClass('bg-gray-100', 'text-gray-800')
  })
})
