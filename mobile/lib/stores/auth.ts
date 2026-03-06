import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { API_URL } from "../config";
const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

/** Nettoyage sans crash si SecureStore indisponible (Expo Go, web, ou client non reconstruit). */
async function safeDeleteStorageKeys() {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
  } catch {
    // SecureStore peut être indisponible (Expo Go, web, module natif non lié)
  }
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  primaryRole: string;
  roles: string[];
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    fullName: string;
    email: string;
    phone?: string;
    password: string;
    primaryRole: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  restore: () => Promise<void>;
  setAuth: (token: string, user: User) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: async (token: string, user: User) => {
    set({ token, user, isAuthenticated: true, isLoading: false });
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    } catch {
      // Persistance optionnelle : si SecureStore indisponible (Expo Go, web), la session reste en mémoire
    }
  },

  login: async (email: string, password: string) => {
    const res = await axios.post(`${API_URL}/api/mobile/auth/login`, {
      email,
      password,
    });
    await get().setAuth(res.data.token, res.data.user);
  },

  register: async (data) => {
    const res = await axios.post(`${API_URL}/api/mobile/auth/register`, data);
    await get().setAuth(res.data.token, res.data.user);
  },

  logout: async () => {
    await safeDeleteStorageKeys();
    set({ token: null, user: null, isAuthenticated: false, isLoading: false });
  },

  restore: async () => {
    try {
      let token: string | null = null;
      let userStr: string | null = null;
      try {
        token = await SecureStore.getItemAsync(TOKEN_KEY);
        userStr = await SecureStore.getItemAsync(USER_KEY);
      } catch {
        // SecureStore indisponible (Expo Go, web)
      }

      if (!token || !userStr) {
        set({ isLoading: false });
        return;
      }

      // Refresh the token to get fresh user data
      const res = await axios.post(
        `${API_URL}/api/mobile/auth/refresh`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await get().setAuth(res.data.token, res.data.user);
    } catch {
      // Token invalid or expired → clean up
      await safeDeleteStorageKeys();
      set({ token: null, user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
