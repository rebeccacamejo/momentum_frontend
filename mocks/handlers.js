const { http, HttpResponse } = require('msw')

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const handlers = [
  // Auth endpoints
  http.post(`${API_BASE}/auth/magic-link`, () => {
    return HttpResponse.json({
      success: true,
      message: 'Magic link sent to your email'
    })
  }),

  http.post(`${API_BASE}/auth/callback`, () => {
    return HttpResponse.json({
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      user: {
        id: 'mock-user-id',
        email: 'test@example.com',
        user_metadata: { name: 'Test User' }
      },
      expires_in: 3600
    })
  }),

  http.get(`${API_BASE}/auth/user`, () => {
    return HttpResponse.json({
      id: 'mock-user-id',
      email: 'test@example.com',
      name: 'Test User',
      avatar_url: 'https://example.com/avatar.jpg',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    })
  }),

  http.put(`${API_BASE}/auth/user`, () => {
    return HttpResponse.json({
      id: 'mock-user-id',
      email: 'test@example.com',
      name: 'Updated Test User',
      avatar_url: 'https://example.com/avatar.jpg',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T12:00:00Z'
    })
  }),

  http.post(`${API_BASE}/auth/signout`, () => {
    return HttpResponse.json({
      message: 'Successfully signed out'
    })
  }),

  // Deliverable endpoints
  http.get(`${API_BASE}/deliverables`, () => {
    return HttpResponse.json([
      {
        id: 'deliverable-1',
        client_name: 'Test Client 1',
        created_at: '2023-01-01T00:00:00Z'
      },
      {
        id: 'deliverable-2',
        client_name: 'Test Client 2',
        created_at: '2023-01-02T00:00:00Z'
      }
    ])
  }),

  http.get(`${API_BASE}/deliverables/:id`, ({ params }) => {
    return new HttpResponse(
      `<html><body><h1>Deliverable ${params.id}</h1><p>Mock deliverable content</p></body></html>`,
      {
        headers: {
          'Content-Type': 'text/html'
        }
      }
    )
  }),

  http.get(`${API_BASE}/deliverables/:id/pdf`, ({ params }) => {
    return HttpResponse.json({
      url: `https://example.com/signed/${params.id}.pdf?expires=3600`
    })
  }),

  http.post(`${API_BASE}/upload`, () => {
    return HttpResponse.json({
      id: 'new-deliverable-id',
      html: '<html><body><h1>New Deliverable</h1><p>Generated from upload</p></body></html>'
    })
  }),

  http.post(`${API_BASE}/generate`, () => {
    return HttpResponse.json({
      id: 'generated-deliverable-id',
      html: '<html><body><h1>Generated Deliverable</h1><p>Generated from text</p></body></html>'
    })
  }),

  // Brand endpoints
  http.get(`${API_BASE}/brand/settings`, () => {
    return HttpResponse.json({
      primary_color: '#2A3EB1',
      secondary_color: '#4C6FE7',
      logo_url: 'https://example.com/logo.png'
    })
  }),

  http.put(`${API_BASE}/brand/settings`, () => {
    return HttpResponse.json({
      success: true,
      settings: {
        primary_color: '#FF5722',
        secondary_color: '#FFC107',
        logo_url: 'https://example.com/new-logo.png'
      }
    })
  }),

  http.post(`${API_BASE}/brand/logo`, () => {
    return HttpResponse.json({
      url: 'https://example.com/uploaded-logo.png'
    })
  }),

  // Organization endpoints
  http.get(`${API_BASE}/organizations`, () => {
    return HttpResponse.json([
      {
        id: 'org-1',
        organization_id: 'org-1',
        role: 'owner',
        organizations: {
          id: 'org-1',
          name: 'Test Organization',
          slug: 'test-organization',
          created_at: '2023-01-01T00:00:00Z'
        },
        created_at: '2023-01-01T00:00:00Z'
      }
    ])
  }),

  http.post(`${API_BASE}/organizations`, () => {
    return HttpResponse.json({
      id: 'new-org-id',
      name: 'New Organization',
      slug: 'new-organization',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    })
  }),

  http.get(`${API_BASE}/organizations/:id`, ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      name: 'Test Organization',
      slug: 'test-organization',
      logo_url: 'https://example.com/org-logo.png',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    })
  }),

  http.get(`${API_BASE}/organizations/:id/members`, () => {
    return HttpResponse.json([
      {
        id: 'member-1',
        user_id: 'user-1',
        role: 'owner',
        profiles: {
          id: 'user-1',
          email: 'owner@example.com',
          name: 'Owner User',
          avatar_url: null
        }
      },
      {
        id: 'member-2',
        user_id: 'user-2',
        role: 'member',
        profiles: {
          id: 'user-2',
          email: 'member@example.com',
          name: 'Member User',
          avatar_url: 'https://example.com/member-avatar.jpg'
        }
      }
    ])
  }),

  // Error simulation endpoints
  http.get(`${API_BASE}/error/500`, () => {
    return new HttpResponse(null, { status: 500 })
  }),

  http.get(`${API_BASE}/error/404`, () => {
    return new HttpResponse(null, { status: 404 })
  }),

  http.get(`${API_BASE}/error/401`, () => {
    return new HttpResponse(null, { status: 401 })
  }),
]

module.exports = { handlers }