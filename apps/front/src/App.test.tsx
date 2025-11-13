import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import App from "./App";
import { AuthContext } from "./auth/AuthContext";
import type { AuthContextValue } from "./auth/types";

describe("App", () => {
  it("renders the app title", () => {
    const mockUser = {
      id: "1",
      name: "Test User",
      email: "test@example.com",
    };

    const mockLoginResult = {
      token: "fake-token",
      tokenType: "bearer",
      user: mockUser,
    };

    const authValue: AuthContextValue = {
      token: mockLoginResult.token,
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      login: async () => mockLoginResult,
      logout: () => {},
    };

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <AuthContext.Provider value={authValue}>
          <App />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", {
        name: /admin dashboard/i,
      })
    ).toBeInTheDocument();
  });
});
