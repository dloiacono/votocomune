import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import ConfirmDialog from '../ConfirmDialog'

describe('ConfirmDialog', () => {
  const defaultProps = {
    isOpen: true,
    title: 'Conferma eliminazione',
    message: 'Sei sicuro di voler eliminare?',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  }

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <ConfirmDialog {...defaultProps} isOpen={false} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders title and message when open', () => {
    render(<ConfirmDialog {...defaultProps} />)
    expect(screen.getByText('Conferma eliminazione')).toBeInTheDocument()
    expect(screen.getByText('Sei sicuro di voler eliminare?')).toBeInTheDocument()
  })

  it('renders default button text', () => {
    render(<ConfirmDialog {...defaultProps} />)
    expect(screen.getByText('Conferma')).toBeInTheDocument()
    expect(screen.getByText('Annulla')).toBeInTheDocument()
  })

  it('renders custom button text', () => {
    render(
      <ConfirmDialog {...defaultProps} confirmText="Elimina" cancelText="Indietro" />
    )
    expect(screen.getByText('Elimina')).toBeInTheDocument()
    expect(screen.getByText('Indietro')).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button is clicked', async () => {
    const onConfirm = vi.fn()
    render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />)
    await userEvent.click(screen.getByText('Conferma'))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const onCancel = vi.fn()
    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />)
    await userEvent.click(screen.getByText('Annulla'))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when backdrop is clicked', async () => {
    const onCancel = vi.fn()
    const { container } = render(
      <ConfirmDialog {...defaultProps} onCancel={onCancel} />
    )
    const backdrop = container.querySelector('.bg-black.bg-opacity-50')
    await userEvent.click(backdrop)
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
