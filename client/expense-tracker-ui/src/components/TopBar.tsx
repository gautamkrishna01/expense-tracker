import React, { useContext } from "react";
import { User, Menu } from "lucide-react";
import { UserContext } from "../App";

interface TopBarProps {
  onMenuClick: () => void;
}

const TopBar = ({ onMenuClick }: TopBarProps) => {
  const userContext = useContext(UserContext);
  const user = userContext?.user;

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center px-4 md:px-8 sticky top-0 z-10 w-full transition-colors duration-200">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex items-center space-x-4 ml-auto">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {user?.name || "User"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user?.email || ""}
          </p>
        </div>
        <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 shadow-sm">
          <User size={20} />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
