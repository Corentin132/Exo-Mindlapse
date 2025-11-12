import { Navigate, Route, Routes } from "react-router-dom";

import "./App.css";
import Dashboard from "./Dashboard";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signin" replace />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
}

export default App;
