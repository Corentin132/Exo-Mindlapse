import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "@admin-dashboard/shared-ui/theme/AppTheme";
import ColorModeSelect from "@admin-dashboard/shared-ui/theme/ColorModeSelect";
import type { User } from "@admin-dashboard/types";
import { createHttpClient } from "@admin-dashboard/shared-ui/lib/httpClient";
import { Link as RouterLink } from "react-router-dom";

import { API_BASE_URL } from "./config/api";
import { sanitizeInput } from "./lib/sanitize";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

const authClient = createHttpClient({
  baseUrl: API_BASE_URL,
  credentials: "include",
  defaultHeaders: {
    "Content-Type": "application/json",
    // Origin: "http://localhost:3000",
  },
});

export default function SignUp(props: { disableCustomTheme?: boolean }) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);

  const validateInputs = () => {
    const email = document.getElementById("email") as HTMLInputElement | null;
    const password = document.getElementById(
      "password"
    ) as HTMLInputElement | null;
    const name = document.getElementById("name") as HTMLInputElement | null;

    const sanitizedEmail = sanitizeInput(email?.value ?? "");
    const sanitizedPassword = sanitizeInput(password?.value ?? "", {
      trim: false,
    });
    const sanitizedName = sanitizeInput(name?.value ?? "");

    if (email && sanitizedEmail !== email.value) {
      email.value = sanitizedEmail;
    }

    if (password && sanitizedPassword !== password.value) {
      password.value = sanitizedPassword;
    }

    if (name && sanitizedName !== name.value) {
      name.value = sanitizedName;
    }

    let isValid = true;

    if (!sanitizedEmail || !/\S+@\S+\.\S+/.test(sanitizedEmail)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!sanitizedPassword || sanitizedPassword.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (!sanitizedName || sanitizedName.length < 1) {
      setNameError(true);
      setNameErrorMessage("Name is required.");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValid = validateInputs();
    if (!isValid) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const body: User = {
      name: sanitizeInput((formData.get("name") as string | null) ?? ""),
      email: sanitizeInput((formData.get("email") as string | null) ?? ""),
      password: sanitizeInput(
        (formData.get("password") as string | null) ?? "",
        { trim: false }
      ),
    };

    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);

    try {
      const response = await authClient.post("/api/register", body);

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        const message =
          payload?.message ||
          payload?.error ||
          payload?.errors?.[0]?.message ||
          "Unable to create your account.";
        setSubmitError(message);
        return;
      }

      setSubmitSuccess(true);
      setNameError(false);
      setNameErrorMessage("");
      setEmailError(false);
      setEmailErrorMessage("");
      setPasswordError(false);
      setPasswordErrorMessage("");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unexpected error while trying to create your account.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Jon Snow"
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={emailError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? "error" : "primary"}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing up..." : "Sign up"}
            </Button>
            {submitError && (
              <Typography color="error" variant="body2" role="alert">
                {submitError}
              </Typography>
            )}
            {submitSuccess && !submitError && (
              <Typography color="success.main" variant="body2">
                Account created successfully. You can now sign in.
              </Typography>
            )}
          </Box>
          <Divider>
            <Typography sx={{ color: "text.secondary" }}>or</Typography>
          </Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* <Button
              fullWidth
              variant="outlined"
              onClick={() => alert("Sign up with Google")}
              startIcon={<GoogleIcon />}
            >
              Sign up with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert("Sign up with Facebook")}
              startIcon={<FacebookIcon />}
            >
              Sign up with Facebook
            </Button> */}
            <Typography sx={{ textAlign: "center" }}>
              Already have an account?{" "}
              <Link component={RouterLink} to="/signin" variant="body2">
                Sign in
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
