import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  PieChart,
  BarChart3,
  Bell,
  User,
  Settings,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();

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
        ? "bg-indigo-50 text-indigo-700"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`;

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 overflow-y-auto">
      {/* Brand Logo */}
      <div className="p-6">
        <div className="flex items-center space-x-3 text-indigo-600">
          <Wallet className="h-8 w-8" />
          <span className="text-xl font-bold tracking-tight text-gray-900">
            SpendWise
          </span>
        </div>
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

        <NavLink to="/budget" className={navItemClass}>
          <PieChart className="mr-3 h-5 w-5" />
          Budget
        </NavLink>

        <NavLink to="/reports" className={navItemClass}>
          <BarChart3 className="mr-3 h-5 w-5" />
          Reports
        </NavLink>

        <div className="pt-4 mt-4 border-t border-gray-100">
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

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex w-full items-center px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
