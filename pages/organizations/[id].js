import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

export default function OrganizationDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { user, organizations, currentOrg, refreshUserData, loading: authLoading } = useAuth();

  const [organization, setOrganization] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: '',
    role: 'member'
  });
  const [inviteLoading, setInviteLoading] = useState(false);

  const currentMembership = organizations.find(org => org.organization_id === id);
  const canManageMembers = currentMembership && ['admin', 'owner'].includes(currentMembership.role);
  const isOwner = currentMembership?.role === 'owner';

  useEffect(() => {
    if (id && user) {
      fetchOrganizationData();
    }
  }, [id, user]);

  const fetchOrganizationData = async () => {
    try {
      setLoading(true);

      // Fetch organization details
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', id)
        .single();

      if (orgError) throw orgError;
      setOrganization(orgData);

      // Fetch organization members
      const { data: membersData, error: membersError } = await supabase
        .from('organization_members')
        .select(`
          *,
          profiles (
            id,
            email,
            name,
            avatar_url
          )
        `)
        .eq('organization_id', id);

      if (membersError) throw membersError;
      setMembers(membersData || []);

    } catch (error) {
      console.error('Error fetching organization data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = async (e) => {
    e.preventDefault();
    setInviteLoading(true);
    setError('');
    setMessage('');

    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', inviteData.email)
        .single();

      if (existingUser) {
        // Check if already a member
        const { data: existingMember } = await supabase
          .from('organization_members')
          .select('id')
          .eq('user_id', existingUser.id)
          .eq('organization_id', id)
          .single();

        if (existingMember) {
          setError('User is already a member of this organization');
          return;
        }

        // Add existing user as member
        const { error } = await supabase
          .from('organization_members')
          .insert({
            user_id: existingUser.id,
            organization_id: id,
            role: inviteData.role
          });

        if (error) throw error;
        setMessage('User added to organization successfully');
      } else {
        // For now, just show a message that invitation would be sent
        setMessage(`Invitation would be sent to ${inviteData.email} (user registration flow not implemented)`);
      }

      setShowInviteForm(false);
      setInviteData({ email: '', role: 'member' });
      await fetchOrganizationData();

    } catch (error) {
      setError(error.message);
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRemoveMember = async (memberId, memberEmail) => {
    if (!confirm(`Are you sure you want to remove ${memberEmail} from this organization?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('organization_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      setMessage('Member removed successfully');
      await fetchOrganizationData();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLeaveOrganization = async () => {
    if (isOwner) {
      setError('Organization owner must transfer ownership before leaving');
      return;
    }

    if (!confirm('Are you sure you want to leave this organization?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('organization_members')
        .delete()
        .eq('user_id', user.id)
        .eq('organization_id', id);

      if (error) throw error;

      await refreshUserData();
      router.push('/organizations');
    } catch (error) {
      setError(error.message);
    }
  };

  if (authLoading || loading) {
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

  if (!organization || !currentMembership) {
    return (
      <>
        <Navbar />
        <main className="max-w-4xl mx-auto py-8 px-4">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900">Organization not found</h1>
            <p className="mt-2 text-gray-600">You don't have access to this organization.</p>
            <Link href="/organizations" className="mt-4 btn-primary">
              Back to Organizations
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{organization.name} – Momentum</title>
        <meta name="description" content={`Manage ${organization.name} organization settings and members.`} />
      </Head>
      <Navbar />

      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <nav className="text-sm text-gray-600 mb-2">
              <Link href="/organizations" className="hover:text-gray-900">Organizations</Link>
              <span className="mx-2">›</span>
              <span className="text-gray-900">{organization.name}</span>
            </nav>
            <h1 className="text-3xl font-bold text-gray-900">{organization.name}</h1>
            <p className="mt-1 text-gray-600 capitalize">Your role: {currentMembership.role}</p>
          </div>
          {canManageMembers && (
            <button
              onClick={() => setShowInviteForm(true)}
              className="btn-primary"
            >
              Invite Member
            </button>
          )}
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

        {/* Invite Member Form */}
        {showInviteForm && (
          <div className="card p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Invite New Member</h2>
            <form onSubmit={handleInviteMember} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={inviteData.email}
                  onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  id="role"
                  value={inviteData.role}
                  onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="viewer">Viewer</option>
                  <option value="member">Member</option>
                  {isOwner && <option value="admin">Admin</option>}
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={inviteLoading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {inviteLoading ? 'Inviting...' : 'Send Invite'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowInviteForm(false);
                    setInviteData({ email: '', role: 'member' });
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

        {/* Members List */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Members ({members.length})</h2>
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                    {member.profiles?.avatar_url ? (
                      <img
                        src={member.profiles.avatar_url}
                        alt=""
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-600">
                        {member.profiles?.name?.[0] || member.profiles?.email[0]}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {member.profiles?.name || member.profiles?.email}
                    </p>
                    <p className="text-xs text-gray-500">{member.profiles?.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500 capitalize">{member.role}</span>
                  {member.user_id === user.id && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">You</span>
                  )}
                  {canManageMembers && member.user_id !== user.id && member.role !== 'owner' && (
                    <button
                      onClick={() => handleRemoveMember(member.id, member.profiles?.email)}
                      className="text-sm text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Organization Actions */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Organization Actions</h2>
          <div className="space-y-3">
            {!isOwner && (
              <button
                onClick={handleLeaveOrganization}
                className="text-red-600 hover:text-red-900 text-sm font-medium"
              >
                Leave Organization
              </button>
            )}
            {isOwner && (
              <p className="text-sm text-gray-500">
                As the organization owner, you cannot leave until you transfer ownership to another member.
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}