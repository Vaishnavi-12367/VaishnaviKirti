import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Subscription from "./pages/Subscription";
import Billing from "./pages/Billing";
import Analytics from "./pages/Analytics";
import Notes from "./pages/Notes";
import Invite from "./pages/Invite";
import Settings from "./pages/Settings";
import Team from "./pages/Team";
import ProtectedRoute from "./components/ProtectedRoute";
import Activity from "./pages/Activity";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/subscription"
          element={
            localStorage.getItem("userRole") === "Admin"
              ? (
                <ProtectedRoute>
                  <Subscription />
                </ProtectedRoute>
              )
              : <Navigate to="/dashboard" />
          }
        />

        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <Billing />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/invite"
          element={
            localStorage.getItem("userRole") === "Admin"
              ? (
                <ProtectedRoute>
                  <Invite />
                </ProtectedRoute>
              )
              : <Navigate to="/dashboard" />
          }
        />

        <Route
          path="/team"
          element={
            localStorage.getItem("userRole") === "Admin"
              ? (
                <ProtectedRoute>
                  <Team />
                </ProtectedRoute>
              )
              : <Navigate to="/dashboard" />
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
  path="/activity"
  element={
    <ProtectedRoute>
      <Activity />
    </ProtectedRoute>
  }
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
