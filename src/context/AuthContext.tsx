// src/context/AuthContext.tsx

"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/utils/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  session: Session | null;
}

const AuthContext = createContext<AuthContextProps>({ user: null, loading: true, session: null });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
      } else {
        setSession(session ?? null);
        setUser(session?.user ?? null);
      }
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, session }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
