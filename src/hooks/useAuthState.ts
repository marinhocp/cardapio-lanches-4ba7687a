
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
        .select('user_type, status')
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
        const isUserAdmin = profile.user_type === 'admin' && profile.status === 'approved';
        setIsAdmin(isUserAdmin);
        setUserStatus(profile.status);
        
        console.log('Is admin:', isUserAdmin);
        console.log('User status:', profile.status);
        
        // Show message if user is not approved
        if (profile.status === 'pending') {
          toast({
            title: "Conta pendente de aprovação",
            description: "Sua conta está aguardando aprovação por um administrador.",
            variant: "default",
          });
        } else if (profile.status === 'rejected') {
          toast({
            title: "Conta rejeitada",
            description: "Sua conta foi rejeitada. Entre em contato com o suporte.",
            variant: "destructive",
          });
        } else if (profile.status === 'suspended') {
          toast({
            title: "Conta suspensa",
            description: "Sua conta foi suspensa. Entre em contato com o suporte.",
            variant: "destructive",
          });
        }
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
