import { createHttpClient } from "@admin-dashboard/shared-ui/lib/httpClient";

import { API_BASE_URL } from "../config/api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginUser {
  id: string;
  name: string;
  email: string;
}

export interface LoginResult {
  token: string;
  tokenType: string;
  user: LoginUser;
}

const authClient = createHttpClient({
  baseUrl: API_BASE_URL,
  credentials: "include",
  defaultHeaders: {
    "Content-Type": "application/json",
  },
});

export async function login(
  credentials: LoginCredentials
): Promise<LoginResult> {
  const response = await authClient.post("/api/login", credentials);
  const payload = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    const message =
      (payload &&
        typeof payload === "object" &&
        "message" in payload &&
        typeof payload.message === "string" &&
        payload.message) ||
      (payload &&
        typeof payload === "object" &&
        "errors" in payload &&
        Array.isArray(payload.errors) &&
        typeof payload.errors[0]?.message === "string" &&
        payload.errors[0]?.message) ||
      "Unable to sign you in.";

    throw new Error(message);
  }

  if (!payload || typeof payload !== "object") {
    throw new Error("Réponse inattendue du serveur.");
  }

  const candidate = payload as Partial<LoginResult>;

  if (
    typeof candidate.token !== "string" ||
    typeof candidate.tokenType !== "string" ||
    candidate.tokenType.toLowerCase() !== "bearer" ||
    !candidate.user ||
    typeof candidate.user !== "object" ||
    typeof candidate.user.id !== "string" ||
    typeof candidate.user.email !== "string" ||
    typeof candidate.user.name !== "string"
  ) {
    throw new Error("Le jeton d'authentification est invalide.");
  }

  return candidate as LoginResult;
}
