import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

declare global {
  interface Window {
    Kakao: any;
  }
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, name?: string) => void;
  loginWithGoogle: () => Promise<void>;
  loginWithKakao: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  login: () => {},
  loginWithGoogle: async () => {},
  loginWithKakao: async () => {},
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

  // Kakao SDK 초기화
  useEffect(() => {
    const kakaoKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;
    if (kakaoKey && kakaoKey !== 'YOUR_KAKAO_JAVASCRIPT_KEY_HERE' && window.Kakao) {
      try {
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(kakaoKey);
        }
      } catch (error) {
        console.error('Kakao SDK initialization failed:', error);
      }
    }
  }, []);

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
          if (parsed.uid && !parsed.uid.startsWith('kakao_')) {
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

  const loginWithKakao = () => {
    return new Promise<void>((resolve, reject) => {
      if (!window.Kakao) {
        console.error('Kakao SDK not loaded');
        reject(new Error('Kakao SDK가 로드되지 않았습니다.'));
        return;
      }

      const kakaoKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;
      if (!kakaoKey || kakaoKey === 'YOUR_KAKAO_JAVASCRIPT_KEY_HERE') {
        reject(new Error('Kakao JavaScript 키가 설정되지 않았습니다. .env 파일을 확인해주세요.'));
        return;
      }

      if (!window.Kakao.isInitialized()) {
        try {
          window.Kakao.init(kakaoKey);
        } catch (error) {
          reject(new Error('Kakao SDK 초기화에 실패했습니다.'));
          return;
        }
      }

      window.Kakao.Auth.login({
        success: (authObj: any) => {
          window.Kakao.API.request({
            url: '/v2/user/me',
            success: (res: any) => {
              const kakaoAccount = res.kakao_account;
              const email = kakaoAccount?.email || `kakao_${res.id}@viewlight.com`;
              const name = kakaoAccount?.profile?.nickname || `Kakao User ${res.id}`;
              const photoURL = kakaoAccount?.profile?.thumbnail_image_url || kakaoAccount?.profile?.profile_image_url || undefined;

              const u: User = {
                email,
                name,
                photoURL,
                uid: `kakao_${res.id}`,
              };

              setIsLoggedIn(true);
              setUser(u);
              localStorage.setItem('viewlight_logged_in', 'true');
              localStorage.setItem('viewlight_current_user', JSON.stringify(u));
              resolve();
            },
            fail: (error: any) => {
              console.error('Kakao user profile request failed:', error);
              reject(error);
            },
          });
        },
        fail: (err: any) => {
          console.error('Kakao Login error:', err);
          reject(err);
        },
      });
    });
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
    <AuthContext.Provider value={{ isLoggedIn, user, login, loginWithGoogle, loginWithKakao, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
