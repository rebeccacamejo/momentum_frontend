import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, profile, currentOrg, organizations, loading: authLoading } = useAuth();

  useEffect(() => {
    async function load() {
      try {
        // TODO: Fetch user's deliverables from backend
        // For now, show empty state
        setDeliverables([]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading && user) {
      load();
    }
  }, [user, authLoading]);

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
      <Navbar />
      <main className="max-w-4xl mx-auto py-8 px-4">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back{profile?.name ? `, ${profile.name}` : ''}!
          </h1>
          <p className="mt-1 text-gray-600">
            {currentOrg ? `Working in ${currentOrg.name}` : 'Ready to create amazing deliverables'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/new" className="card p-6 hover:shadow-lg transition-shadow border-2 border-dashed border-gray-300 hover:border-primary-300">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Create Deliverable</h3>
              <p className="text-sm text-gray-500 mt-1">Upload a recording or generate from text</p>
            </div>
          </Link>

          <Link href="/profile" className="card p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Profile</h3>
              <p className="text-sm text-gray-500 mt-1">Manage your account settings</p>
            </div>
          </Link>

          <Link href="/settings" className="card p-6 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Settings</h3>
              <p className="text-sm text-gray-500 mt-1">Brand and organization settings</p>
            </div>
          </Link>
        </div>

        {/* Organizations Section */}
        {organizations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Organizations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {organizations.map((orgMember) => (
                <div key={orgMember.organization_id} className="card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{orgMember.organizations.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{orgMember.role}</p>
                    </div>
                    {currentOrg?.id === orgMember.organization_id && (
                      <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deliverables Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Deliverables</h2>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : deliverables.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No deliverables</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating your first deliverable.</p>
              <div className="mt-6">
                <Link href="/new" className="btn-primary">
                  Create Deliverable
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {deliverables.map((d) => (
                <div key={d.id} className="card p-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{d.client_name}</h3>
                    <p className="text-sm text-gray-500">Generated on {new Date(d.created_at).toLocaleString()}</p>
                  </div>
                  <div className="space-x-2">
                    <Link href={`/deliverables/${d.id}`} className="text-primary-600 hover:text-primary-900 font-medium">
                      View
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