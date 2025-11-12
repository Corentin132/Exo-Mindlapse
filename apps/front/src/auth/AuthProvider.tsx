import * as React from "react";

import type { LoginCredentials, LoginResult } from "../api/auth";
import { login as loginRequest } from "../api/auth";

import { AuthContext } from "./AuthContext";
import type { AuthContextValue } from "./types";

const AUTH_TOKEN_KEY = "admin-dashboard:token";
const AUTH_USER_KEY = "admin-dashboard:user";

type StoredAuth = {
  token: string | null;
  user: LoginResult["user"] | null;
};

function readStoredAuth(): StoredAuth {
  if (typeof window === "undefined") {
    return { token: null, user: null };
  }

  const localToken = window.localStorage.getItem(AUTH_TOKEN_KEY);
  const sessionToken = window.sessionStorage.getItem(AUTH_TOKEN_KEY);

  if (localToken) {
    const rawUser = window.localStorage.getItem(AUTH_USER_KEY);
    return {
      token: localToken,
      user: rawUser ? (JSON.parse(rawUser) as LoginResult["user"]) : null,
    };
  }

  if (sessionToken) {
    const rawUser = window.sessionStorage.getItem(AUTH_USER_KEY);
    return {
      token: sessionToken,
      user: rawUser ? (JSON.parse(rawUser) as LoginResult["user"]) : null,
    };
  }

  return { token: null, user: null };
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [{ token, user }, setAuthState] = React.useState<{
    token: string | null;
    user: LoginResult["user"] | null;
  }>(() => {
    if (typeof window === "undefined") {
      return { token: null, user: null };
    }
    const stored = readStoredAuth();
    return { token: stored.token, user: stored.user };
  });

  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoading(false);
  }, []);

  const persistAuth = React.useCallback(
    (authToken: string, authUser: LoginResult["user"], remember?: boolean) => {
      if (typeof window === "undefined") {
        return;
      }
      const targetStorage = remember
        ? window.localStorage
        : window.sessionStorage;

      window.localStorage.removeItem(AUTH_TOKEN_KEY);
      window.localStorage.removeItem(AUTH_USER_KEY);
      window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
      window.sessionStorage.removeItem(AUTH_USER_KEY);

      targetStorage.setItem(AUTH_TOKEN_KEY, authToken);
      targetStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
    },
    []
  );

  const handleLogin = React.useCallback(
    async (credentials: LoginCredentials & { remember?: boolean }) => {
      const { remember, ...requestPayload } = credentials;
      const result = await loginRequest(requestPayload);
      persistAuth(result.token, result.user, remember);
      setAuthState({ token: result.token, user: result.user });
      return result;
    },
    [persistAuth]
  );

  const handleLogout = React.useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
    window.localStorage.removeItem(AUTH_USER_KEY);
    window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
    window.sessionStorage.removeItem(AUTH_USER_KEY);
    setAuthState({ token: null, user: null });
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isLoading,
      login: handleLogin,
      logout: handleLogout,
    }),
    [token, user, isLoading, handleLogin, handleLogout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
