import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from '@/types/auth';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userStatus, setUserStatus] = useState<string | null>(null);
  const { toast } = useToast();

  const checkUserProfile = async (userId: string) => {
    try {
      console.log('Checking user profile for:', userId);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        setIsAdmin(false);
        setUserStatus(null);
        return;
      }
      
      if (profile) {
        console.log('User profile found:', profile);
        const isUserAdmin = profile.role === 'admin';
        setIsAdmin(isUserAdmin);
        setUserStatus('approved'); // Temporário - sem status no banco
        
        console.log('Is admin:', isUserAdmin);
        console.log('User role:', profile.role);
        
        // Sem sistema de aprovação por enquanto
      } else {
        console.log('No profile found for user');
        setIsAdmin(false);
        setUserStatus(null);
      }
    } catch (error) {
      console.error('Error in checkUserProfile:', error);
      setIsAdmin(false);
      setUserStatus(null);
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check user profile with a slight delay to ensure the profile exists
          setTimeout(async () => {
            await checkUserProfile(session.user.id);
          }, 100);
        } else {
          setIsAdmin(false);
          setUserStatus(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkUserProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    session,
    loading,
    isAdmin,
    userStatus,
    toast
  };
};