import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import { RoleEnum, type RoleType } from "~/types/general";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  token: string | null;
  roles?: RoleType[];
  setToken: (token: string) => void;
  clearToken: () => void;
  isAuthenticated: () => boolean;
}

const COOKIE_NAME = "empsched_auth_token";
const COOKIE_EXPIRY = 7;

const parseJwtPayload = (token: string): any => {
  try {
    return jwtDecode(token);
  } catch (err) {
    console.warn("Failed to parse token");
    return null;
  }
};

const extractRoles = (token: string): RoleType[] => {
  try {
    if (!token) return [];

    const payload = parseJwtPayload(token);
    if (!payload || !payload.roles) return [];

    return payload.roles as RoleType[];
  } catch (err) {
    console.warn("Failed to extract roles from token");
    return [];
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,

      setToken: (token: string) => {
        const roles = extractRoles(token);
        set({ token, roles });
      },

      clearToken: () => {
        set({ token: null, roles: [] });
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
