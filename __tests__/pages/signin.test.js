import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider } from '../../contexts/AuthContext'
import SignIn from '../../pages/signin'
import '../mocks/supabase'

// Mock the useAuth hook
const mockUseAuth = {
  user: null,
  signInWithMagicLink: jest.fn(),
  signInWithGoogle: jest.fn(),
}

jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth,
}))

// Mock next/router
const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    query: {},
  }),
}))

const renderSignIn = () => {
  return render(
    <AuthProvider>
      <SignIn />
    </AuthProvider>
  )
}

describe('SignIn Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAuth.user = null
    mockUseAuth.signInWithMagicLink.mockClear()
    mockUseAuth.signInWithGoogle.mockClear()
    mockPush.mockClear()
  })

  test('renders sign in form', () => {
    renderSignIn()

    expect(screen.getByText('Sign in to your account')).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send magic link/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument()
  })

  test('handles magic link submission', async () => {
    const user = userEvent.setup()
    mockUseAuth.signInWithMagicLink.mockResolvedValue({ success: true })

    renderSignIn()

    const emailInput = screen.getByLabelText(/email address/i)
    const submitButton = screen.getByRole('button', { name: /send magic link/i })

    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockUseAuth.signInWithMagicLink).toHaveBeenCalledWith('test@example.com')
    })

    expect(screen.getByText(/check your email/i)).toBeInTheDocument()
  })

  test('shows error message on magic link failure', async () => {
    const user = userEvent.setup()
    mockUseAuth.signInWithMagicLink.mockRejectedValue(new Error('Failed to send magic link'))

    renderSignIn()

    const emailInput = screen.getByLabelText(/email address/i)
    const submitButton = screen.getByRole('button', { name: /send magic link/i })

    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/failed to send magic link/i)).toBeInTheDocument()
    })
  })

  test('validates email format', async () => {
    const user = userEvent.setup()
    renderSignIn()

    const emailInput = screen.getByLabelText(/email address/i)
    const submitButton = screen.getByRole('button', { name: /send magic link/i })

    await user.type(emailInput, 'invalid-email')
    await user.click(submitButton)

    // HTML5 validation should prevent submission
    expect(mockUseAuth.signInWithMagicLink).not.toHaveBeenCalled()
  })

  test('handles Google OAuth sign in', async () => {
    const user = userEvent.setup()
    mockUseAuth.signInWithGoogle.mockResolvedValue({ success: true })

    renderSignIn()

    const googleButton = screen.getByRole('button', { name: /continue with google/i })
    await user.click(googleButton)

    await waitFor(() => {
      expect(mockUseAuth.signInWithGoogle).toHaveBeenCalled()
    })
  })

  test('shows error message on Google OAuth failure', async () => {
    const user = userEvent.setup()
    mockUseAuth.signInWithGoogle.mockRejectedValue(new Error('OAuth failed'))

    renderSignIn()

    const googleButton = screen.getByRole('button', { name: /continue with google/i })
    await user.click(googleButton)

    await waitFor(() => {
      expect(screen.getByText(/oauth failed/i)).toBeInTheDocument()
    })
  })

  test('shows loading state during magic link submission', async () => {
    const user = userEvent.setup()
    mockUseAuth.signInWithMagicLink.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    )

    renderSignIn()

    const emailInput = screen.getByLabelText(/email address/i)
    const submitButton = screen.getByRole('button', { name: /send magic link/i })

    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)

    expect(screen.getByText(/sending magic link/i)).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  test('shows loading state during Google OAuth', async () => {
    const user = userEvent.setup()
    mockUseAuth.signInWithGoogle.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    )

    renderSignIn()

    const googleButton = screen.getByRole('button', { name: /continue with google/i })
    await user.click(googleButton)

    expect(screen.getByText(/redirecting/i)).toBeInTheDocument()
    expect(googleButton).toBeDisabled()
  })

  test('redirects authenticated user to dashboard', async () => {
    mockUseAuth.user = { id: 'test-user', email: 'test@example.com' }

    renderSignIn()

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  test('handles redirect parameter', async () => {
    // Mock router with redirect parameter
    jest.doMock('next/router', () => ({
      useRouter: () => ({
        push: mockPush,
        query: { redirectTo: '/profile' },
      }),
    }))

    mockUseAuth.user = { id: 'test-user', email: 'test@example.com' }

    renderSignIn()

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/profile')
    })
  })

  test('clears error messages when switching between auth methods', async () => {
    const user = userEvent.setup()
    mockUseAuth.signInWithMagicLink.mockRejectedValue(new Error('Magic link failed'))
    mockUseAuth.signInWithGoogle.mockResolvedValue({ success: true })

    renderSignIn()

    // First, try magic link and get error
    const emailInput = screen.getByLabelText(/email address/i)
    const submitButton = screen.getByRole('button', { name: /send magic link/i })

    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/magic link failed/i)).toBeInTheDocument()
    })

    // Then try Google OAuth
    const googleButton = screen.getByRole('button', { name: /continue with google/i })
    await user.click(googleButton)

    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText(/magic link failed/i)).not.toBeInTheDocument()
    })
  })

  test('accessibility compliance', () => {
    renderSignIn()

    // Check for proper form labels
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()

    // Check for button accessibility
    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toBeInTheDocument()
    })

    // Check for headings structure
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  test('form submission with enter key', async () => {
    const user = userEvent.setup()
    mockUseAuth.signInWithMagicLink.mockResolvedValue({ success: true })

    renderSignIn()

    const emailInput = screen.getByLabelText(/email address/i)

    await user.type(emailInput, 'test@example.com')
    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(mockUseAuth.signInWithMagicLink).toHaveBeenCalledWith('test@example.com')
    })
  })
})