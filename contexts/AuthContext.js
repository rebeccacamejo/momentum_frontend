import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [currentOrg, setCurrentOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchUserData(session.user);
        } else {
          setProfile(null);
          setOrganizations([]);
          setCurrentOrg(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (user) => {
    try {
      setLoading(true);

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
      } else if (profileData) {
        setProfile(profileData);
      } else {
        // Create basic profile if it doesn't exist
        const newProfile = {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email.split('@')[0],
          avatar_url: user.user_metadata?.avatar_url || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data: createdProfile } = await supabase
          .from('profiles')
          .upsert(newProfile)
          .select()
          .single();

        setProfile(createdProfile || newProfile);
      }

      // Fetch user organizations
      const { data: orgsData, error: orgsError } = await supabase
        .from('organization_members')
        .select(`
          *,
          organizations (*)
        `)
        .eq('user_id', user.id);

      if (orgsError) {
        console.error('Error fetching organizations:', orgsError);
      } else {
        setOrganizations(orgsData || []);

        // Set current org from localStorage or default to first org
        const savedOrgId = localStorage.getItem('current-org-id');
        const targetOrg = orgsData?.find(org => org.organization_id === savedOrgId) || orgsData?.[0];

        if (targetOrg) {
          setCurrentOrg({
            ...targetOrg.organizations,
            membership: {
              role: targetOrg.role,
              id: targetOrg.id,
              created_at: targetOrg.created_at
            }
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithMagicLink = async (email, redirectTo) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo || `${window.location.origin}/auth/callback`
      }
    });

    if (error) throw error;
    return { success: true };
  };

  const signInWithGoogle = async (redirectTo) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo || `${window.location.origin}/auth/callback`
      }
    });

    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // Clear local state
    setUser(null);
    setProfile(null);
    setOrganizations([]);
    setCurrentOrg(null);
    setSession(null);
    localStorage.removeItem('current-org-id');
  };

  const updateProfile = async (updates) => {
    if (!user) throw new Error('No user logged in');

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;

    setProfile(data);
    return data;
  };

  const switchOrganization = (org) => {
    setCurrentOrg(org);
    localStorage.setItem('current-org-id', org.id);
  };

  const createOrganization = async (name, slug) => {
    if (!user) throw new Error('No user logged in');

    const { data, error } = await supabase
      .from('organizations')
      .insert({
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Add user as owner
    const { error: memberError } = await supabase
      .from('organization_members')
      .insert({
        user_id: user.id,
        organization_id: data.id,
        role: 'owner',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (memberError) throw memberError;

    // Refresh organizations
    await fetchUserData(user);

    return data;
  };

  const refreshUserData = () => {
    if (user) {
      return fetchUserData(user);
    }
  };

  const value = {
    user,
    profile,
    organizations,
    currentOrg,
    session,
    loading,
    signInWithMagicLink,
    signInWithGoogle,
    signOut,
    updateProfile,
    switchOrganization,
    createOrganization,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};