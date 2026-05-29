import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Auth from "./components/Auth";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";

// Layout component to wrap protected routes with the Sidebar
const MainLayout = () => {
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
          <Route
            path="/expenses/all"
            element={<div className="text-2xl font-bold">All Expenses</div>}
          />
          <Route
            path="/expenses/add"
            element={<div className="text-2xl font-bold">Add Expense</div>}
          />
          <Route
            path="/expenses/categories"
            element={<div className="text-2xl font-bold">Categories</div>}
          />
          <Route
            path="/income/all"
            element={<div className="text-2xl font-bold">All Income</div>}
          />
          <Route
            path="/income/add"
            element={<div className="text-2xl font-bold">Add Income</div>}
          />
          <Route
            path="/budget"
            element={<div className="text-2xl font-bold">Budget</div>}
          />
          <Route
            path="/reports"
            element={<div className="text-2xl font-bold">Reports</div>}
          />
          <Route
            path="/notifications"
            element={<div className="text-2xl font-bold">Notifications</div>}
          />
          <Route
            path="/profile"
            element={<div className="text-2xl font-bold">Profile</div>}
          />
          <Route
            path="/settings"
            element={<div className="text-2xl font-bold">Settings</div>}
          />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
