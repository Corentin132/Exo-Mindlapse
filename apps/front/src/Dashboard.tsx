import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "./auth/useAuth";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = React.useCallback(() => {
    logout();
    navigate("/signin", { replace: true });
  }, [logout, navigate]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        textAlign: "center",
      }}
    >
      <Typography variant="h4" component="h1">
        Dashboard
      </Typography>
      <Typography variant="subtitle1">
        Hello {user?.name ?? "!"} 👋. Content is coming soon.
      </Typography>
      <Button variant="outlined" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
}
