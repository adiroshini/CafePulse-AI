import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

interface User {
  id: string;
  email: string;
  phone: string;
}

interface Business {
  id: string;
  cafe_name: string;
  location: string;
  business_type: string;
  num_employees: number;
  operating_hours: string;
}

interface AuthContextType {
  user: User | null;
  business: Business | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, phone: string, password: string) => Promise<{ dev_otp: string }>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  setupBusiness: (data: Omit<Business, 'id'>) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        const res = await authAPI.getMe();
        setUser(res.data.user);
        setBusiness(res.data.business);
      }
    } catch {
      await AsyncStorage.removeItem('access_token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await authAPI.login(email, password);
    await AsyncStorage.setItem('access_token', res.data.access_token);
    await checkAuth();
  };

  const register = async (email: string, phone: string, password: string) => {
    const res = await authAPI.register(email, phone, password);
    return { dev_otp: res.data.dev_otp };
  };

  const verifyOTP = async (email: string, otp: string) => {
    await authAPI.verifyOTP(email, otp);
  };

  const setupBusiness = async (data: Omit<Business, 'id'>) => {
    await authAPI.setupBusiness(data);
    await checkAuth();
  };

  const logout = async () => {
    await AsyncStorage.removeItem('access_token');
    setUser(null);
    setBusiness(null);
  };

  const refreshUser = async () => {
    await checkAuth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        business,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        verifyOTP,
        setupBusiness,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
