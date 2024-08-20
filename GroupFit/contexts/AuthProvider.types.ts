import { Session, User } from '@supabase/supabase-js';
import { ReactNode } from 'react';

export interface UserContextType {
  user: User | null;
  session: Session | null;
  setSession: (session: Session | null) => void;
  isLoading: boolean;
}

export type UserProviderProps = {
  children: ReactNode;
};
