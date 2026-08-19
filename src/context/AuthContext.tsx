import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, name?: string) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  login: () => {},
  loginWithGoogle: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('viewlight_logged_in') === 'true';
  });

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('viewlight_current_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Firebase Auth 상태 변화 감지 및 동기화
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const u: User = {
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '사용자',
          photoURL: firebaseUser.photoURL || undefined,
          uid: firebaseUser.uid,
        };
        setIsLoggedIn(true);
        setUser(u);
        localStorage.setItem('viewlight_logged_in', 'true');
        localStorage.setItem('viewlight_current_user', JSON.stringify(u));
      } else {
        const savedUser = localStorage.getItem('viewlight_current_user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          // 임시 로그인이 아닌 Firebase 로그인 유저(uid 존재)가 로그아웃된 경우 상태 초기화
          if (parsed.uid) {
            setIsLoggedIn(false);
            setUser(null);
            localStorage.removeItem('viewlight_logged_in');
            localStorage.removeItem('viewlight_current_user');
          }
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const login = (email: string, name?: string) => {
    const u: User = { email, name: name || email.split('@')[0] };
    setIsLoggedIn(true);
    setUser(u);
    localStorage.setItem('viewlight_logged_in', 'true');
    localStorage.setItem('viewlight_current_user', JSON.stringify(u));
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign-Out Error:', error);
    }
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('viewlight_logged_in');
    localStorage.removeItem('viewlight_current_user');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
