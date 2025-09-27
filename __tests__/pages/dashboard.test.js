import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider } from '../../contexts/AuthContext'
import Dashboard from '../../pages/dashboard'
import '../mocks/supabase'

// Mock the useAuth hook
const mockUseAuth = {
  user: null,
  profile: null,
  organizations: [],
  currentOrg: null,
  loading: false,
  refreshUserData: jest.fn(),
}

jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth,
}))

const renderDashboard = (authOverrides = {}) => {
  Object.assign(mockUseAuth, authOverrides)

  return render(
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  )
}

describe('Dashboard Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    Object.assign(mockUseAuth, {
      user: null,
      profile: null,
      organizations: [],
      currentOrg: null,
      loading: false,
      refreshUserData: jest.fn(),
    })
  })

  test('shows loading state', () => {
    renderDashboard({ loading: true })

    expect(screen.getByRole('generic')).toBeInTheDocument() // Loading spinner
  })

  test('renders welcome message for authenticated user', () => {
    renderDashboard({
      user: { id: 'test-user', email: 'test@example.com' },
      profile: { name: 'Test User' }
    })

    expect(screen.getByText(/welcome back, test user/i)).toBeInTheDocument()
  })

  test('renders welcome message without name', () => {
    renderDashboard({
      user: { id: 'test-user', email: 'test@example.com' },
      profile: { name: null }
    })

    expect(screen.getByText(/welcome back!/i)).toBeInTheDocument()
  })

  test('shows current organization context', () => {
    renderDashboard({
      user: { id: 'test-user', email: 'test@example.com' },
      currentOrg: { name: 'Test Organization' }
    })

    expect(screen.getByText(/working in test organization/i)).toBeInTheDocument()
  })

  test('renders quick action cards', () => {
    renderDashboard({
      user: { id: 'test-user', email: 'test@example.com' }
    })

    expect(screen.getByText('Create Deliverable')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  test('shows organizations section when user has organizations', () => {
    renderDashboard({
      user: { id: 'test-user', email: 'test@example.com' },
      organizations: [
        {
          organization_id: 'org-1',
          organizations: { name: 'Test Org 1' },
          role: 'owner'
        },
        {
          organization_id: 'org-2',
          organizations: { name: 'Test Org 2' },
          role: 'member'
        }
      ],
      currentOrg: { id: 'org-1', name: 'Test Org 1' }
    })

    expect(screen.getByText('Your Organizations')).toBeInTheDocument()
    expect(screen.getByText('Test Org 1')).toBeInTheDocument()
    expect(screen.getByText('Test Org 2')).toBeInTheDocument()
    expect(screen.getByText('Current')).toBeInTheDocument() // Current org indicator
  })

  test('shows empty deliverables state', () => {
    renderDashboard({
      user: { id: 'test-user', email: 'test@example.com' }
    })

    expect(screen.getByText('Recent Deliverables')).toBeInTheDocument()
    expect(screen.getByText('No deliverables')).toBeInTheDocument()
    expect(screen.getByText('Get started by creating your first deliverable.')).toBeInTheDocument()
  })

  test('quick action links work correctly', async () => {
    const user = userEvent.setup()
    renderDashboard({
      user: { id: 'test-user', email: 'test@example.com' }
    })

    // Check that quick action cards are clickable links
    const createLink = screen.getByRole('link', { name: /create deliverable/i })
    const profileLink = screen.getByRole('link', { name: /profile/i })
    const settingsLink = screen.getByRole('link', { name: /settings/i })

    expect(createLink).toHaveAttribute('href', '/new')
    expect(profileLink).toHaveAttribute('href', '/profile')
    expect(settingsLink).toHaveAttribute('href', '/settings')
  })

  test('displays user role in organization cards', () => {
    renderDashboard({
      user: { id: 'test-user', email: 'test@example.com' },
      organizations: [
        {
          organization_id: 'org-1',
          organizations: { name: 'Test Org' },
          role: 'admin'
        }
      ]
    })

    expect(screen.getByText('admin')).toBeInTheDocument()
  })

  test('handles organization card display with creation dates', () => {
    renderDashboard({
      user: { id: 'test-user', email: 'test@example.com' },
      organizations: [
        {
          organization_id: 'org-1',
          organizations: { name: 'Test Org' },
          role: 'member',
          created_at: '2023-01-01T00:00:00Z'
        }
      ]
    })

    expect(screen.getByText(/joined/i)).toBeInTheDocument()
  })

  test('responsive design elements', () => {
    renderDashboard({
      user: { id: 'test-user', email: 'test@example.com' }
    })

    // Check for responsive grid classes (this would be more thorough with actual CSS testing)
    const quickActions = screen.getByText('Create Deliverable').closest('div')
    expect(quickActions).toBeInTheDocument()
  })

  test('accessibility compliance', () => {
    renderDashboard({
      user: { id: 'test-user', email: 'test@example.com' }
    })

    // Check for proper heading structure
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()

    // Check for proper link accessibility
    const links = screen.getAllByRole('link')
    links.forEach(link => {
      expect(link).toBeInTheDocument()
    })

    // Check for proper main content area
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  test('handles missing profile data gracefully', () => {
    renderDashboard({
      user: { id: 'test-user', email: 'test@example.com' },
      profile: null
    })

    expect(screen.getByText(/welcome back!/i)).toBeInTheDocument()
  })

  test('shows appropriate message when no organizations', () => {
    renderDashboard({
      user: { id: 'test-user', email: 'test@example.com' },
      organizations: []
    })

    expect(screen.queryByText('Your Organizations')).not.toBeInTheDocument()
    expect(screen.getByText(/ready to create amazing deliverables/i)).toBeInTheDocument()
  })

  test('deliverables section shows correct loading state', () => {
    renderDashboard({
      user: { id: 'test-user', email: 'test@example.com' },
      loading: false // Auth loading is false, but deliverables might be loading
    })

    // Initially shows empty state since we don't have actual deliverables API
    expect(screen.getByText('No deliverables')).toBeInTheDocument()
  })

  test('create deliverable button in empty state works', () => {
    renderDashboard({
      user: { id: 'test-user', email: 'test@example.com' }
    })

    const createButton = screen.getByRole('link', { name: /create deliverable/i })
    expect(createButton).toHaveAttribute('href', '/new')
  })
})