import type { LoginResult } from "../api/auth";
import type { LoginCredentials } from "../api/auth";

export interface AuthContextValue {
  user: LoginResult["user"] | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    credentials: LoginCredentials & { remember?: boolean }
  ) => Promise<LoginResult>;
  logout: () => void;
}
