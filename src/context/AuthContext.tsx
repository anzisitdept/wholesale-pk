'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export interface UserProfile {
  uid: string;
  email?: string;
  phone?: string;
  displayName?: string;
  photoURL?: string;
  createdAt?: any;
  lastLogin?: any;
  authProvider?: string;
  promoCode?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  signOut: () => Promise<void>;
  syncUserProfile: (firebaseUser: User, additionalInfo?: { phone?: string; promoCode?: string }) => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const syncUserProfile = async (
    firebaseUser: User,
    additionalInfo?: { phone?: string; promoCode?: string }
  ): Promise<UserProfile | null> => {
    if (!firebaseUser || !firebaseUser.uid) return null;
    const userRef = doc(db, 'users', firebaseUser.uid);
    try {
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          phone: additionalInfo?.phone || firebaseUser.phoneNumber || '',
          displayName: firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Customer'),
          photoURL: firebaseUser.photoURL || '',
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          authProvider: firebaseUser.providerData?.[0]?.providerId || 'email',
          promoCode: additionalInfo?.promoCode || '',
          role: 'customer',
        };
        await setDoc(userRef, newProfile);
        setProfile(newProfile);
        return newProfile;
      } else {
        const existingData = snap.data() as UserProfile;
        const updatedProfile = {
          ...existingData,
          phone: additionalInfo?.phone || existingData.phone || firebaseUser.phoneNumber || '',
          lastLogin: serverTimestamp(),
        };
        await setDoc(userRef, { lastLogin: serverTimestamp(), phone: updatedProfile.phone }, { merge: true });
        setProfile(updatedProfile);
        return updatedProfile;
      }
    } catch (err) {
      console.error('Error syncing user profile to Firestore:', err);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await syncUserProfile(currentUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        signOut,
        syncUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
