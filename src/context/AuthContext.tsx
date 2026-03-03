'use client';

import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { destroyCookie, parseCookies } from 'nookies';
import jwtDecode from 'jwt-decode';

interface User {
  id: number;
  nom: string;
  prenom: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (identifier: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

interface RegisterData {
  nom: string;
  prenom: string;
  identifiant: string;
  email?: string;
  telephone: string;
  genre: string;
  password: string;
  roleId: number;
  vehicleType?: string;
  zone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/auth'; // Adjust to your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshAccessToken = useCallback(async () => {
    try {
      // Assuming you have a /refresh endpoint in backend that returns new access_token using refresh_token cookie
      // Backend example (add to your service/controller):
      // async refresh(@Req() req) {
      //   const refreshToken = req.cookies.refresh_token;
      //   // Validate session, generate new access_token
      //   // ...
      //   return { access_token: newAccessToken };
      // }
      const res = await api.post('/refresh');
      const { access_token } = res.data;
      setAccessToken(access_token);
      const decoded: any = jwtDecode(access_token);
      setUser({ id: decoded.sub, role: decoded.role } as User); // Fetch full user if needed
      return access_token;
    } catch (err) {
      logout();
      return null;
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const cookies = parseCookies();
      if (cookies.refresh_token) {
        const token = await refreshAccessToken();
        if (token) {
          // Fetch user details if needed
          try {
            const res = await api.get('/me', { headers: { Authorization: `Bearer ${token}` } });
            setUser(res.data);
          } catch {}
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [refreshAccessToken]);

  useEffect(() => {
    // Axios interceptor for token refresh
    const reqInterceptor = api.interceptors.request.use(async (config) => {
      if (!accessToken) {
        const newToken = await refreshAccessToken();
        if (newToken) config.headers.Authorization = `Bearer ${newToken}`;
      } else {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });

    const resInterceptor = api.interceptors.response.use(
      (res) => res,
      async (err) => {
        if (err.response?.status === 401 && !err.config._retry) {
          err.config._retry = true;
          const newToken = await refreshAccessToken();
          if (newToken) {
            err.config.headers.Authorization = `Bearer ${newToken}`;
            return api(err.config);
          }
        }
        return Promise.reject(err);
      },
    );

    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(resInterceptor);
    };
  }, [accessToken, refreshAccessToken]);

  const login = async (identifier: string, password: string) => {
    const res = await api.post('/login', { identifiant: identifier, email: identifier, password });
    const { access_token, user: userData } = res.data;
    setAccessToken(access_token);
    setUser(userData);
    router.push('/profile');
  };

  const register = async (data: RegisterData) => {
    const res = await api.post('/register', data);
    // After register, perhaps auto-login or redirect to login
    router.push('/login');
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch {}
    setUser(null);
    setAccessToken(null);
    destroyCookie(null, 'refresh_token', { path: '/' });
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (undefined === context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};