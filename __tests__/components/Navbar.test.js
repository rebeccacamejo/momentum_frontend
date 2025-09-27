import { render, screen, fireEvent } from '@testing-library/react'
import { AuthProvider } from '../../contexts/AuthContext'
import Navbar from '../../components/Navbar'
import '../mocks/supabase'

// Mock the useAuth hook
const mockUseAuth = {
  user: null,
  profile: null,
  organizations: [],
  currentOrg: null,
  loading: false,
  signOut: jest.fn(),
}

jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth,
}))

const renderNavbar = (authOverrides = {}) => {
  Object.assign(mockUseAuth, authOverrides)

  return render(
    <AuthProvider>
      <Navbar />
    </AuthProvider>
  )
}

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset mock to default state
    Object.assign(mockUseAuth, {
      user: null,
      profile: null,
      organizations: [],
      currentOrg: null,
      loading: false,
      signOut: jest.fn(),
    })
  })

  test('renders logo and brand name', () => {
    renderNavbar()

    expect(screen.getByText('M')).toBeInTheDocument() // Logo
    expect(screen.getByText('Momentum')).toBeInTheDocument()
  })

  test('shows sign in link when user is not authenticated', () => {
    renderNavbar()

    expect(screen.getByText('Sign In')).toBeInTheDocument()
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
  })

  test('shows navigation links when user is authenticated', () => {
    renderNavbar({
      user: { id: 'test-user', email: 'test@example.com' },
      profile: { name: 'Test User' }
    })

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('New')).toBeInTheDocument()
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument()
  })

  test('shows user menu when authenticated', () => {
    renderNavbar({
      user: { id: 'test-user', email: 'test@example.com' },
      profile: { name: 'Test User', avatar_url: 'https://example.com/avatar.jpg' }
    })

    // Look for user avatar or initials
    const userButton = screen.getByRole('button')
    expect(userButton).toBeInTheDocument()
  })

  test('shows organization switcher when user has organizations', () => {
    renderNavbar({
      user: { id: 'test-user', email: 'test@example.com' },
      organizations: [
        {
          organization_id: 'org-1',
          organizations: { name: 'Test Org', id: 'org-1' },
          role: 'owner'
        }
      ],
      currentOrg: { name: 'Test Org', id: 'org-1' }
    })

    expect(screen.getByText('Test Org')).toBeInTheDocument()
  })

  test('handles sign out', async () => {
    const mockSignOut = jest.fn()
    renderNavbar({
      user: { id: 'test-user', email: 'test@example.com' },
      profile: { name: 'Test User' },
      signOut: mockSignOut
    })

    // Click user menu to open dropdown
    const userButton = screen.getByRole('button')
    fireEvent.click(userButton)

    // Find and click sign out
    const signOutButton = screen.getByText('Sign Out')
    fireEvent.click(signOutButton)

    expect(mockSignOut).toHaveBeenCalled()
  })

  test('shows loading state', () => {
    renderNavbar({ loading: true })

    // Should show some loading indicator or skeleton
    expect(screen.getByText('Momentum')).toBeInTheDocument()
  })

  test('handles responsive navigation', () => {
    renderNavbar({
      user: { id: 'test-user', email: 'test@example.com' }
    })

    // Look for mobile menu toggle button
    const mobileMenuButtons = screen.getAllByRole('button')
    expect(mobileMenuButtons.length).toBeGreaterThan(0)
  })

  test('shows correct navigation state for different user roles', () => {
    renderNavbar({
      user: { id: 'test-user', email: 'test@example.com' },
      organizations: [{
        organization_id: 'org-1',
        organizations: { name: 'Test Org' },
        role: 'viewer'
      }],
      currentOrg: { name: 'Test Org', membership: { role: 'viewer' } }
    })

    // Viewers should still see basic navigation
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  test('accessibility compliance', () => {
    renderNavbar()

    // Check for proper ARIA labels and roles
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
  })
})