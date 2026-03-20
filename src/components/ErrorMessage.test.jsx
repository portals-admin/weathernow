import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ErrorMessage from './ErrorMessage'

describe('ErrorMessage', () => {
  it('renders nothing when no message', () => {
    const { container } = render(<ErrorMessage message={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders error message', () => {
    render(<ErrorMessage message="Something went wrong" />)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('has alert role', () => {
    render(<ErrorMessage message="Error" />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('calls onDismiss when dismiss button is clicked', () => {
    const onDismiss = vi.fn()
    render(<ErrorMessage message="Error" onDismiss={onDismiss} />)
    fireEvent.click(screen.getByLabelText('Dismiss error'))
    expect(onDismiss).toHaveBeenCalledOnce()
  })
})
