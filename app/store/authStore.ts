import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
  isAuthenticated: () => boolean;
}

const COOKIE_NAME = "empsched_auth_token";
const COOKIE_EXPIRY = 7;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,

      setToken: (token: string) => {
        set({ token });
      },

      clearToken: () => {
        set({ token: null });
      },

      isAuthenticated: () => {
        return !!get().token;
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const cookie = Cookies.get(COOKIE_NAME);
          return cookie ? JSON.parse(cookie) : null;
        },
        setItem: (name, value) => {
          Cookies.set(COOKIE_NAME, JSON.stringify(value), {
            expires: COOKIE_EXPIRY,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });
        },
        removeItem: (name) => {
          Cookies.remove(COOKIE_NAME);
        },
      })),
    }
  )
);
