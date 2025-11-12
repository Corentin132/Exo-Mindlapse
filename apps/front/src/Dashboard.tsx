import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "./auth/useAuth";
import ProductList from "./components/ProductList";
import AppTheme from "@admin-dashboard/shared-ui/theme/AppTheme";
import CssBaseline from "@mui/material/CssBaseline";
import ColorModeSelect from "@admin-dashboard/shared-ui/theme/ColorModeSelect";

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = React.useCallback(() => {
    logout();
    navigate("/signin", { replace: true });
  }, [logout, navigate]);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
      <Button
        variant="outlined"
        sx={{ position: "fixed", top: "1rem", right: "8rem" }}
        onClick={handleLogout}
      >
        Logout
      </Button>
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
          Admin Dashboard, welcome {user?.name ?? "!"} 👋 !
        </Typography>
        <ProductList />
      </Box>
    </AppTheme>
  );
}
