import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';

export default function Organizations() {
  const { user, organizations, currentOrg, switchOrganization, createOrganization, refreshUserData, loading: authLoading } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateOrg = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await createOrganization(formData.name, formData.slug);
      setMessage('Organization created successfully!');
      setShowCreateForm(false);
      setFormData({ name: '', slug: '' });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchOrg = async (org) => {
    try {
      switchOrganization(org);
      setMessage(`Switched to ${org.name}`);
    } catch (error) {
      setError(error.message);
    }
  };

  if (authLoading) {
    return (
      <>
        <Navbar />
        <main className="max-w-4xl mx-auto py-8 px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Organizations – Momentum</title>
        <meta name="description" content="Manage your organizations and team settings." />
      </Head>
      <Navbar />

      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Organizations</h1>
            <p className="mt-1 text-gray-600">Manage your organizations and team settings.</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            Create Organization
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 p-3 bg-green-100 border border-green-400 text-green-700 rounded-xl">
            {message}
          </div>
        )}

        {/* Create Organization Form */}
        {showCreateForm && (
          <div className="card p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Organization</h2>
            <form onSubmit={handleCreateOrg} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Organization Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter organization name"
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                  Slug (Optional)
                </label>
                <input
                  type="text"
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="organization-slug"
                />
                <p className="mt-1 text-xs text-gray-500">
                  If not provided, will be generated from the organization name
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating...' : 'Create Organization'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setFormData({ name: '', slug: '' });
                    setError('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Organizations List */}
        <div>
          {organizations.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No organizations</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating your first organization.</p>
              <div className="mt-6">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="btn-primary"
                >
                  Create Organization
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizations.map((orgMember) => (
                <div key={orgMember.organization_id} className="card p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {orgMember.organizations.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 capitalize">
                        {orgMember.role}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Joined {new Date(orgMember.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {currentOrg?.id === orgMember.organization_id && (
                      <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    {currentOrg?.id !== orgMember.organization_id && (
                      <button
                        onClick={() => handleSwitchOrg({
                          ...orgMember.organizations,
                          membership: {
                            role: orgMember.role,
                            id: orgMember.id,
                            created_at: orgMember.created_at
                          }
                        })}
                        className="text-sm text-primary-600 hover:text-primary-900 font-medium"
                      >
                        Switch to
                      </button>
                    )}
                    <Link
                      href={`/organizations/${orgMember.organization_id}`}
                      className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}