// Mock Supabase client for testing
export const createMockSupabaseClient = () => {
  const mockTable = {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    upsert: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    execute: jest.fn(),
  }

  const mockAuth = {
    getSession: jest.fn().mockResolvedValue({
      data: {
        session: {
          access_token: 'mock-token',
          refresh_token: 'mock-refresh-token',
          user: {
            id: 'mock-user-id',
            email: 'test@example.com',
            user_metadata: { name: 'Test User' }
          }
        }
      }
    }),
    signInWithOtp: jest.fn().mockResolvedValue({ error: null }),
    signInWithOAuth: jest.fn().mockResolvedValue({ error: null }),
    signOut: jest.fn().mockResolvedValue({ error: null }),
    onAuthStateChange: jest.fn().mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } }
    }),
  }

  const mockStorage = {
    from: jest.fn().mockReturnValue({
      upload: jest.fn().mockResolvedValue({ error: null }),
      getPublicUrl: jest.fn().mockReturnValue({
        data: { publicUrl: 'https://example.com/file.jpg' }
      })
    })
  }

  return {
    from: jest.fn().mockReturnValue(mockTable),
    auth: mockAuth,
    storage: mockStorage,
  }
}

// Mock the Supabase module
jest.mock('../lib/supabase', () => ({
  supabase: createMockSupabaseClient()
}))

export const mockSupabaseClient = createMockSupabaseClient()