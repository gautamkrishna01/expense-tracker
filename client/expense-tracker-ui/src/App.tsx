import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { authAPI } from "./services/api";

import AllExpenses from "./pages/AllExpenses";
import AddExpense from "./pages/AddExpense";
import AllIncome from "./pages/AllIncome";
import AddIncome from "./pages/AddIncome";
import AllBudgets from "./pages/AllBudgets";
import Auth from "./components/Auth";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Dashboard from "./components/Dashboard";
import Reports from "./components/Reports";
import Notifications from "./components/Notifications";
import Profile from "./components/Profile";
import Settings from "./components/Settings";

// Layout component to wrap protected routes with the Sidebar
const MainLayout = () => {
  const [loading, setLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to fetch current user data using the cookie
        await authAPI.getCurrentUser();
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex">
      <Sidebar />
      {/* ml-64 matches the width of the sidebar (w-64) */}
      <main className="flex-1 ml-64 min-h-screen bg-gray-50 p-8">
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/register" element={<Auth mode="register" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Authenticated Routes with Sidebar */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenses/all" element={<AllExpenses />} />
          <Route path="/expenses/add" element={<AddExpense />} />
          <Route
            path="/expenses/categories"
            element={<div className="text-2xl font-bold">Categories</div>}
          />
          <Route path="/income/all" element={<AllIncome />} />
          <Route path="/income/add" element={<AddIncome />} />
          <Route path="/budget" element={<AllBudgets />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
