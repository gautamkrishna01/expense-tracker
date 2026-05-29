import React, { useState } from "react";
import { NavLink } from "react-router-dom";
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
  ChevronDown,
  PlusCircle,
  List,
  Tags,
} from "lucide-react";

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    expenses: true,
    income: false,
  });

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? "bg-indigo-50 text-indigo-700"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`;

  const subItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center pl-11 pr-4 py-2 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? "text-indigo-600"
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
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

        {/* Expenses Collapsible */}
        <div>
          <button
            onClick={() => toggleMenu("expenses")}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <div className="flex items-center">
              <Receipt className="mr-3 h-5 w-5 text-gray-400" />
              Expenses
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                openMenus.expenses ? "rotate-180" : ""
              }`}
            />
          </button>
          {openMenus.expenses && (
            <div className="mt-1 space-y-1">
              <NavLink to="/expenses/all" className={subItemClass}>
                <List className="mr-2 h-4 w-4 opacity-70" />
                All Expenses
              </NavLink>
              <NavLink to="/expenses/add" className={subItemClass}>
                <PlusCircle className="mr-2 h-4 w-4 opacity-70" />
                Add Expense
              </NavLink>
              <NavLink to="/expenses/categories" className={subItemClass}>
                <Tags className="mr-2 h-4 w-4 opacity-70" />
                Categories
              </NavLink>
            </div>
          )}
        </div>

        {/* Income Collapsible */}
        <div>
          <button
            onClick={() => toggleMenu("income")}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <div className="flex items-center">
              <Wallet className="mr-3 h-5 w-5 text-gray-400" />
              Income
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                openMenus.income ? "rotate-180" : ""
              }`}
            />
          </button>
          {openMenus.income && (
            <div className="mt-1 space-y-1">
              <NavLink to="/income/all" className={subItemClass}>
                All Income
              </NavLink>
              <NavLink to="/income/add" className={subItemClass}>
                Add Income
              </NavLink>
            </div>
          )}
        </div>

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
        <button className="flex w-full items-center px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors">
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
