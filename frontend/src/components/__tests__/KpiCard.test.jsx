import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import KpiCard from '../KpiCard'

describe('KpiCard', () => {
  it('renders title and value', () => {
    render(<KpiCard title="Sezioni" value="20" />)
    expect(screen.getByText('Sezioni')).toBeInTheDocument()
    expect(screen.getByText('20')).toBeInTheDocument()
  })

  it('renders subtitle when provided', () => {
    render(<KpiCard title="Votanti" value="300" subtitle="su 450 aventi diritto" />)
    expect(screen.getByText('su 450 aventi diritto')).toBeInTheDocument()
  })

  it('does not render subtitle when not provided', () => {
    const { container } = render(<KpiCard title="Test" value="0" />)
    expect(container.querySelector('.text-xs.text-gray-500')).not.toBeInTheDocument()
  })

  it('renders icon when provided', () => {
    const MockIcon = ({ size }) => <svg data-testid="mock-icon" width={size} height={size} />
    render(<KpiCard title="With Icon" value="5" icon={MockIcon} />)
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument()
  })

  it('does not render icon container when icon is not provided', () => {
    const { container } = render(<KpiCard title="No Icon" value="0" />)
    expect(container.querySelector('.p-3.rounded-lg')).not.toBeInTheDocument()
  })
})
