import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { authAPI } from "../services/api";
import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  Wallet,
  PieChart,
  BarChart3,
  Bell,
  User,
  Settings,
  LogOut,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Close sidebar on mobile when route changes
  React.useEffect(() => {
    onClose();
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      // Call the server to clear the httpOnly cookie
      await authAPI.logout();
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      navigate("/login");
    }
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
    }`;

  return (
    <div
      className={`w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col fixed left-0 top-0 overflow-y-auto transition-all duration-300 z-50 ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      {/* Brand Logo */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3 text-indigo-600">
          <Wallet className="h-8 w-8" />
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            SpendWise
          </span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {/* Dashboard */}
        <NavLink to="/dashboard" className={navItemClass}>
          <LayoutDashboard className="mr-3 h-5 w-5" />
          Dashboard
        </NavLink>

        <NavLink to="/expenses/all" className={navItemClass}>
          <Receipt className="mr-3 h-5 w-5" />
          Expenses
        </NavLink>

        <NavLink to="/income/all" className={navItemClass}>
          <Wallet className="mr-3 h-5 w-5" />
          Income
        </NavLink>

        <NavLink to="/savings/all" className={navItemClass}>
          <PiggyBank className="mr-3 h-5 w-5" />
          Savings
        </NavLink>

        <NavLink to="/budget" className={navItemClass}>
          <PieChart className="mr-3 h-5 w-5" />
          Budget
        </NavLink>

        <NavLink to="/reports" className={navItemClass}>
          <BarChart3 className="mr-3 h-5 w-5" />
          Reports
        </NavLink>

        <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700">
          <NavLink to="/notifications" className={navItemClass}>
            <Bell className="mr-3 h-5 w-5" />
            Notifications
          </NavLink>
          <NavLink to="/profile" className={navItemClass}>
            <User className="mr-3 h-5 w-5" />
            Profile
          </NavLink>
          <NavLink to="/settings" className={navItemClass}>
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </NavLink>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="flex w-full items-center px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
