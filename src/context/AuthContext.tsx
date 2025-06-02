import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  userLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('idToken');
    if (token) {
      setUserLoggedIn(true);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('idToken', token);
    setUserLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('idToken');
    setUserLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ userLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
