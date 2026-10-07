"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { api, ApiError } from '@/lib/api';

interface User {
  id: string;
  phone: string;
  name?: string;
  role: "USER" | "VENDOR" | "ADMIN";
  hasKyc?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("panda_token");
    let active = true;
    if (!storedToken) { queueMicrotask(() => { if (active) setIsLoading(false); }); return () => { active = false; }; }
    api.getMe().then(profile => {
      if (!active) return;
      localStorage.setItem('panda_user', JSON.stringify(profile));
      setToken(storedToken);
      setUser(profile);
    }).catch(error => {
      if (!active) return;
      if (error instanceof ApiError && error.status === 401) {
        localStorage.removeItem('panda_token');
        localStorage.removeItem('panda_user');
      }
    }).finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("panda_token", newToken);
    localStorage.setItem("panda_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("panda_token");
    localStorage.removeItem("panda_user");
    setToken(null);
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      localStorage.setItem("panda_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
