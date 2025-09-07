'use client';

import {
  useState,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
} from 'react';
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { setSuperAdminClaim } from '@/app/actions';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isSuperAdmin: boolean;
  signUp: (email: string, pass: string) => Promise<any>;
  signIn: (email: string, pass: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const tokenResult = await user.getIdTokenResult();
        setIsSuperAdmin(!!tokenResult.claims.super_admin);
      } else {
        setIsSuperAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, pass: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    if (userCredential.user) {
      await setSuperAdminClaim(userCredential.user.uid);
       // Force refresh of the token to get new custom claims
      await userCredential.user.getIdToken(true);
    }
    return userCredential;
  };

  const signIn = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    router.push('/signin');
  };

  const value = {
    user,
    loading,
    isSuperAdmin,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
