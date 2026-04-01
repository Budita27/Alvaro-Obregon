import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import { User } from '../types';

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  isAuthReady: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  toggleTheme: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Apply theme to document
  useEffect(() => {
    if (user?.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [user?.theme]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        
        // Initial profile sync
        try {
          const userDoc = await getDoc(userRef);
          if (!userDoc.exists()) {
            const newUser: User = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || 'Vecino ÁO',
              email: firebaseUser.email || '',
              photoURL: firebaseUser.photoURL || '',
              level: 1,
              points: 0,
              lives: 5,
              isVIP: false,
              isVerified: false,
              role: firebaseUser.email === 'laschonchasaguasfrescas@gmail.com' ? 'admin' : 'user',
              theme: 'light',
              privacySettings: {
                showLevel: true,
                showPoints: true,
                publicProfile: true
              }
            };
            await setDoc(userRef, newUser);
            setUser(newUser);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `users/${firebaseUser.uid}`);
        }

        // Real-time listener for user profile
        const unsubscribeUser = onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
            setUser(snapshot.data() as User);
          }
          setLoading(false);
          setIsAuthReady(true);
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
        });

        return () => unsubscribeUser();
      } else {
        setUser(null);
        setLoading(false);
        setIsAuthReady(true);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const signIn = async () => {
    const { signInWithGoogle } = await import('./firebase');
    await signInWithGoogle();
  };

  const signOut = async () => {
    const { logout } = await import('./firebase');
    await logout();
  };

  const toggleTheme = async () => {
    if (!user) return;
    const newTheme = user.theme === 'dark' ? 'light' : 'dark';
    const userRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(userRef, { theme: newTheme });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  return (
    <FirebaseContext.Provider value={{ user, loading, isAuthReady, signIn, signOut, toggleTheme }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}
