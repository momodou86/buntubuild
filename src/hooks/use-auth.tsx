
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
  signOut as firebaseSignout,
  updateProfile as firebaseUpdateProfile,
  updatePassword as firebaseUpdatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  type User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { setSuperAdminClaim } from '@/app/actions';
import { createUserProfile } from '@/lib/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isSuperAdmin: boolean;
  signUp: (email: string, pass: string, fullName: string) => Promise<any>;
  signIn: (email: string, pass: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (fullName: string, currentPassword?: string, newPassword?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // On any auth state change, force a token refresh to get latest claims
        const tokenResult = await user.getIdTokenResult(true);
        setIsSuperAdmin(!!tokenResult.claims.super_admin);
        setUser(user);
      } else {
        setIsSuperAdmin(false);
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, pass: string, fullName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const newUser = userCredential.user;
    if (newUser) {
      // 1. Set user's display name
      await firebaseUpdateProfile(newUser, { displayName: fullName });
      
      // 2. Create the user profile in Firestore
      await createUserProfile(newUser.uid, email, fullName);

      // 3. Set the custom claim on the server and wait for it to complete
      await setSuperAdminClaim(newUser.uid, email);

      // 4. Force a token refresh on the client to get the new custom claim
      const tokenResult = await newUser.getIdTokenResult(true);

      // 5. Update the user and admin state in the context
      setIsSuperAdmin(!!tokenResult.claims.super_admin);
      setUser(auth.currentUser);
    }
    return userCredential;
  };

  const signIn = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const signOut = async () => {
    await firebaseSignout(auth);
    setUser(null);
    setIsSuperAdmin(false);
    router.push('/signin');
  };

  const updateProfile = async (fullName: string, currentPassword?: string, newPassword?: string) => {
    if (!user) {
      throw new Error('No user is signed in.');
    }

    // Update display name
    if (user.displayName !== fullName) {
      await firebaseUpdateProfile(user, { displayName: fullName });
    }

    // Update password if new password is provided
    if (currentPassword && newPassword) {
      if (!user.email) {
          throw new Error("User email is not available.");
      }
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await firebaseUpdatePassword(user, newPassword);
    }
  };

  const value = {
    user,
    loading,
    isSuperAdmin,
    signUp,
    signIn,
    signOut,
    updateProfile,
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
