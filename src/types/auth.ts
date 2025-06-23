
import { User, Session } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  userStatus: string | null;
}

export interface UserProfile {
  user_type: 'admin' | 'user';
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
}
