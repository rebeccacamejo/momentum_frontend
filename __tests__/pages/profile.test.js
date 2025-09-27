import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider } from '../../contexts/AuthContext'
import Profile from '../../pages/profile'
import '../mocks/supabase'

// Mock the useAuth hook
const mockUseAuth = {
  user: null,
  profile: null,
  organizations: [],
  loading: false,
  updateProfile: jest.fn(),
  signOut: jest.fn(),
}

jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth,
}))

// Mock URL.createObjectURL for file download tests
global.URL.createObjectURL = jest.fn(() => 'mock-blob-url')
global.URL.revokeObjectURL = jest.fn()

const renderProfile = (authOverrides = {}) => {
  Object.assign(mockUseAuth, authOverrides)

  return render(
    <AuthProvider>
      <Profile />
    </AuthProvider>
  )
}

describe('Profile Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    Object.assign(mockUseAuth, {
      user: null,
      profile: null,
      organizations: [],
      loading: false,
      updateProfile: jest.fn(),
      signOut: jest.fn(),
    })

    // Clear DOM manipulation mocks
    document.body.appendChild = jest.fn()
    document.body.removeChild = jest.fn()
    document.createElement = jest.fn().mockReturnValue({
      href: '',
      download: '',
      click: jest.fn(),
    })
  })

  test('renders profile page with user data', () => {
    renderProfile({
      user: { id: 'test-user', email: 'test@example.com' },
      profile: {
        name: 'Test User',
        avatar_url: 'https://example.com/avatar.jpg',
        created_at: '2023-01-01T00:00:00Z'
      }
    })

    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  test('shows loading state', () => {
    renderProfile({ loading: true })

    expect(screen.getByRole('generic')).toBeInTheDocument() // Loading spinner
  })

  test('displays edit form when edit button is clicked', async () => {
    const user = userEvent.setup()
    renderProfile({
      user: { id: 'test-user', email: 'test@example.com' },
      profile: { name: 'Test User', avatar_url: 'https://example.com/avatar.jpg' }
    })

    const editButton = screen.getByText('Edit')
    await user.click(editButton)

    expect(screen.getByDisplayValue('Test User')).toBeInTheDocument()
    expect(screen.getByDisplayValue('https://example.com/avatar.jpg')).toBeInTheDocument()
    expect(screen.getByText('Save Changes')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  test('handles profile update successfully', async () => {
    const user = userEvent.setup()
    mockUseAuth.updateProfile.mockResolvedValue({ success: true })

    renderProfile({
      user: { id: 'test-user', email: 'test@example.com' },
      profile: { name: 'Test User', avatar_url: '' }
    })

    // Enter edit mode
    const editButton = screen.getByText('Edit')
    await user.click(editButton)

    // Update the name
    const nameInput = screen.getByDisplayValue('Test User')
    await user.clear(nameInput)
    await user.type(nameInput, 'Updated User')

    // Save changes
    const saveButton = screen.getByText('Save Changes')
    await user.click(saveButton)

    await waitFor(() => {
      expect(mockUseAuth.updateProfile).toHaveBeenCalledWith({
        name: 'Updated User',
        avatar_url: ''
      })
    })

    expect(screen.getByText('Profile updated successfully!')).toBeInTheDocument()
  })

  test('handles profile update error', async () => {
    const user = userEvent.setup()
    mockUseAuth.updateProfile.mockRejectedValue(new Error('Update failed'))

    renderProfile({
      user: { id: 'test-user', email: 'test@example.com' },
      profile: { name: 'Test User' }
    })

    // Enter edit mode and try to save
    const editButton = screen.getByText('Edit')
    await user.click(editButton)

    const saveButton = screen.getByText('Save Changes')
    await user.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText('Update failed')).toBeInTheDocument()
    })
  })

  test('cancels edit mode correctly', async () => {
    const user = userEvent.setup()
    renderProfile({
      user: { id: 'test-user', email: 'test@example.com' },
      profile: { name: 'Test User', avatar_url: 'https://example.com/avatar.jpg' }
    })

    // Enter edit mode
    const editButton = screen.getByText('Edit')
    await user.click(editButton)

    // Modify the form
    const nameInput = screen.getByDisplayValue('Test User')
    await user.clear(nameInput)
    await user.type(nameInput, 'Modified Name')

    // Cancel
    const cancelButton = screen.getByText('Cancel')
    await user.click(cancelButton)

    // Should be back to view mode with original data
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('Edit')).toBeInTheDocument()
  })

  test('displays organizations correctly', () => {
    renderProfile({
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
      ]
    })

    expect(screen.getByText('Organizations')).toBeInTheDocument()
    expect(screen.getByText('Test Org 1')).toBeInTheDocument()
    expect(screen.getByText('Test Org 2')).toBeInTheDocument()
    expect(screen.getByText('owner')).toBeInTheDocument()
    expect(screen.getByText('member')).toBeInTheDocument()
  })

  test('shows empty organizations state', () => {
    renderProfile({
      user: { id: 'test-user', email: 'test@example.com' },
      organizations: []
    })

    expect(screen.getByText('No organizations yet')).toBeInTheDocument()
  })

  test('displays profile picture correctly', () => {
    renderProfile({
      user: { id: 'test-user', email: 'test@example.com' },
      profile: { avatar_url: 'https://example.com/avatar.jpg' }
    })

    const profileImage = screen.getByAltText('Profile')
    expect(profileImage).toHaveAttribute('src', 'https://example.com/avatar.jpg')
  })

  test('shows default avatar when no image', () => {
    renderProfile({
      user: { id: 'test-user', email: 'test@example.com' },
      profile: { avatar_url: null }
    })

    // Should show SVG icon instead of image
    expect(screen.queryByAltText('Profile')).not.toBeInTheDocument()
  })

  test('opens data export modal', async () => {
    const user = userEvent.setup()
    renderProfile({
      user: { id: 'test-user', email: 'test@example.com' },
      profile: { name: 'Test User' }
    })

    const exportButton = screen.getByText('Export Data')
    await user.click(exportButton)

    expect(screen.getByText('Export Your Data')).toBeInTheDocument()
    expect(screen.getByText('This will download a JSON file')).toBeInTheDocument()
  })

  test('handles data export functionality', async () => {
    const user = userEvent.setup()
    renderProfile({
      user: { id: 'test-user', email: 'test@example.com' },
      profile: { name: 'Test User' },
      organizations: []
    })

    // Open export modal
    const exportButton = screen.getByText('Export Data')
    await user.click(exportButton)

    // Click export
    const exportDataButton = screen.getByText('Export Data')
    await user.click(exportDataButton)

    await waitFor(() => {
      expect(screen.getByText('Data exported successfully!')).toBeInTheDocument()
    })
  })

  test('opens delete account modal', async () => {
    const user = userEvent.setup()
    renderProfile({
      user: { id: 'test-user', email: 'test@example.com' }
    })

    const deleteButton = screen.getByText('Delete Account')
    await user.click(deleteButton)

    expect(screen.getByText('Delete Account')).toBeInTheDocument()
    expect(screen.getByText('This action cannot be undone')).toBeInTheDocument()
  })

  test('handles delete account confirmation', async () => {
    const user = userEvent.setup()
    renderProfile({
      user: { id: 'test-user', email: 'test@example.com' }
    })

    // Open delete modal
    const deleteButton = screen.getByText('Delete Account')
    await user.click(deleteButton)

    // Type confirmation text
    const confirmInput = screen.getByPlaceholderText('DELETE MY ACCOUNT')
    await user.type(confirmInput, 'DELETE MY ACCOUNT')

    // Submit deletion
    const confirmDeleteButton = screen.getByRole('button', { name: 'Delete Account' })
    expect(confirmDeleteButton).not.toBeDisabled()

    await user.click(confirmDeleteButton)

    await waitFor(() => {
      expect(screen.getByText(/not yet implemented/i)).toBeInTheDocument()
    })
  })

  test('delete account button is disabled without confirmation', async () => {
    const user = userEvent.setup()
    renderProfile({
      user: { id: 'test-user', email: 'test@example.com' }
    })

    const deleteButton = screen.getByText('Delete Account')
    await user.click(deleteButton)

    const confirmDeleteButton = screen.getByRole('button', { name: 'Delete Account' })
    expect(confirmDeleteButton).toBeDisabled()
  })

  test('handles sign out', async () => {
    const user = userEvent.setup()
    mockUseAuth.signOut.mockResolvedValue()

    renderProfile({
      user: { id: 'test-user', email: 'test@example.com' }
    })

    const signOutButton = screen.getByText('Sign Out')
    await user.click(signOutButton)

    expect(mockUseAuth.signOut).toHaveBeenCalled()
  })

  test('shows loading state during profile update', async () => {
    const user = userEvent.setup()
    mockUseAuth.updateProfile.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    )

    renderProfile({
      user: { id: 'test-user', email: 'test@example.com' },
      profile: { name: 'Test User' }
    })

    // Enter edit mode and save
    const editButton = screen.getByText('Edit')
    await user.click(editButton)

    const saveButton = screen.getByText('Save Changes')
    await user.click(saveButton)

    expect(screen.getByText('Saving...')).toBeInTheDocument()
    expect(saveButton).toBeDisabled()
  })

  test('accessibility compliance', () => {
    renderProfile({
      user: { id: 'test-user', email: 'test@example.com' },
      profile: { name: 'Test User' }
    })

    // Check for proper heading structure
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()

    // Check for proper form labels in edit mode
    const editButton = screen.getByText('Edit')
    fireEvent.click(editButton)

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
  })
})