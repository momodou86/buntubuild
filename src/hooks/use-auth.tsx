
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
      setLoading(true); // Set loading to true at the start of auth state change
      if (user) {
        try {
          // Force a token refresh to get latest claims on every auth state change.
          const tokenResult = await user.getIdTokenResult(true);
          const isAdmin = !!tokenResult.claims.super_admin;
          
          // Set all state at once to avoid race conditions
          setIsSuperAdmin(isAdmin);
          setUser(user);

        } catch (error) {
          console.error("Error fetching user token:", error);
          setIsSuperAdmin(false);
          setUser(user);
        }
      } else {
        // No user, so reset all state
        setIsSuperAdmin(false);
        setUser(null);
      }
      setLoading(false); // Set loading to false after all checks are done
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
      // This will also trigger the onAuthStateChanged listener above, which will
      // correctly set the isSuperAdmin state.
      await newUser.getIdTokenResult(true);

      // We manually update state here to ensure the UI updates immediately after sign-up
      // without waiting for the listener to re-fire in all cases.
      setUser(auth.currentUser);
      setIsSuperAdmin(email === process.env.NEXT_PUBLIC_ADMIN_EMAIL);
    }
    return userCredential;
  };

  const signIn = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const signOut = async () => {
    await firebaseSignout(auth);
    // The onAuthStateChanged listener will handle resetting state.
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
