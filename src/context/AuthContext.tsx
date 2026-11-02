import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/config';
import { UserProfile, UserRole } from '../types/stock';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  setDemoRole: (role: UserRole) => void;
  setOperatorName: (name: string) => void;
  isDemoUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'thiagorobady84@gmail.com';
const STORAGE_OPERATOR_NAME = 'ce_operator_name';
const STORAGE_OPERATOR_ROLE = 'ce_operator_role';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoUser, setIsDemoUser] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsDemoUser(false);
        setCurrentUser(user);

        // Fetch or create profile in Firestore
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setUserProfile(userSnap.data() as UserProfile);
          } else {
            const isDefaultAdmin = user.email === ADMIN_EMAIL || !user.email;
            const newProfile: UserProfile = {
              id: user.uid,
              email: user.email || 'usuario@sistema.local',
              name: user.displayName || 'Operador de Estoque',
              role: isDefaultAdmin ? 'admin' : 'operador',
              photoUrl: user.photoURL || undefined,
              createdAt: new Date().toISOString()
            };
            await setDoc(userRef, newProfile);
            setUserProfile(newProfile);
          }
        } catch (error) {
          console.warn('Error loading user profile:', error);
          setUserProfile({
            id: user.uid,
            email: user.email || 'usuario@sistema.local',
            name: user.displayName || 'Operador de Estoque',
            role: user.email === ADMIN_EMAIL ? 'admin' : 'operador',
            photoUrl: user.photoURL || undefined,
            createdAt: new Date().toISOString()
          });
        }
      } else {
        // Fallback operational profile with local device memory
        setCurrentUser(null);
        setIsDemoUser(true);

        const savedName = localStorage.getItem(STORAGE_OPERATOR_NAME) || 'Thiago Robady (Administrador)';
        const savedRole = (localStorage.getItem(STORAGE_OPERATOR_ROLE) as UserRole) || 'admin';

        setUserProfile({
          id: `usr_device_${Math.random().toString(36).substring(2, 7)}`,
          email: ADMIN_EMAIL,
          name: savedName,
          role: savedRole,
          createdAt: new Date().toISOString()
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Google Sign In Error:', error);
      alert('Falha ao autenticar com o Google. Usando perfil operacional do sistema.');
    }
  };

  const signOut = async () => {
    try {
      await fbSignOut(auth);
    } catch (error) {
      console.error('Sign Out Error:', error);
    }
  };

  const setDemoRole = (role: UserRole) => {
    if (userProfile) {
      localStorage.setItem(STORAGE_OPERATOR_ROLE, role);
      setUserProfile({
        ...userProfile,
        role
      });
    }
  };

  const setOperatorName = (name: string) => {
    if (userProfile && name.trim()) {
      localStorage.setItem(STORAGE_OPERATOR_NAME, name.trim());
      setUserProfile({
        ...userProfile,
        name: name.trim()
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        signInWithGoogle,
        signOut,
        setDemoRole,
        setOperatorName,
        isDemoUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
