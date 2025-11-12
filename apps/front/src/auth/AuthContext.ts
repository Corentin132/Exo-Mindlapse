import * as React from "react";

import type { AuthContextValue } from "./types";

export const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined
);
