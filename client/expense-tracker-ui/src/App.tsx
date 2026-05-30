import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
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

// User context for sharing user data between components
interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

interface UserContextType {
  user: User | null;
  updateUser: (userData: Partial<User>) => void;
}

const UserContext = React.createContext<UserContextType>({
  user: null,
  updateUser: () => {},
});

// Layout component to wrap protected routes with the Sidebar
const MainLayout = () => {
  const [loading, setLoading] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to fetch current user data using the cookie
        const response = await authAPI.getCurrentUser();
        setUser(response.data);
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const updateUser = (userData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...userData } : null));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64 flex flex-col min-h-screen bg-gray-50">
          <TopBar />
          <main className="p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </UserContext.Provider>
  );
};

// Export context for use in other components
export { UserContext };

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
