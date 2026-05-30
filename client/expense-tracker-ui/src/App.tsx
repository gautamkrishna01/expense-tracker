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
import AllSavings from "./pages/AllSavings";
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
  settings?: {
    currency: string;
    dateFormat: string;
    language: string;
    emailNotifications: boolean;
    budgetAlerts: boolean;
    theme: "light" | "dark";
  };
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
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

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

  // Apply theme globally whenever the user object or their settings change
  React.useEffect(() => {
    if (user?.settings?.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [user]);

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
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div className="flex-1 lg:ml-64 flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 min-w-0">
          <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="flex-1 p-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
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
          <Route path="/savings/all" element={<AllSavings />} />
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
