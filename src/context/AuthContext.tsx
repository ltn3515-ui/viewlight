import React, { createContext, useContext, useState } from 'react';
import { User } from '../types';

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  login: () => {},
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

  const login = (email: string, name?: string) => {
    const u: User = { email, name: name || email.split('@')[0] };
    setIsLoggedIn(true);
    setUser(u);
    localStorage.setItem('viewlight_logged_in', 'true');
    localStorage.setItem('viewlight_current_user', JSON.stringify(u));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('viewlight_logged_in');
    localStorage.removeItem('viewlight_current_user');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
