import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as authApi from '../services/authApi';

interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string, email: string, name: string, picture?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load token and user from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        try {
          const userData = await authApi.getCurrentUser(storedToken);
          setUser(userData);
          setToken(storedToken);
        } catch (error) {
          console.error('Failed to restore session:', error);
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    setUser(response.user);
    setToken(response.token);
    localStorage.setItem('authToken', response.token);
  };

  const register = async (username: string, email: string, password: string) => {
    const response = await authApi.register(username, email, password);
    setUser(response.user);
    setToken(response.token);
    localStorage.setItem('authToken', response.token);
  };

  const loginWithGoogle = async (credential: string, email: string, name: string, picture?: string) => {
    const response = await authApi.googleAuth(credential, email, name, picture);
    setUser(response.user);
    setToken(response.token);
    localStorage.setItem('authToken', response.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, loginWithGoogle, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

