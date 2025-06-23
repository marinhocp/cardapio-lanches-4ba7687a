
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
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type, status')
        .eq('id', userId)
        .single();
      
      if (profile) {
        setIsAdmin(profile.user_type === 'admin' && profile.status === 'approved');
        setUserStatus(profile.status);
        
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
        setIsAdmin(false);
        setUserStatus(null);
      }
    } catch (error) {
      console.log('Error fetching user profile:', error);
      setIsAdmin(false);
      setUserStatus(null);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check user profile
          setTimeout(async () => {
            await checkUserProfile(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
          setUserStatus(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
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
