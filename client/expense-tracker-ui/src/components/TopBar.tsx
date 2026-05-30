import React, { useContext } from "react";
import { User } from "lucide-react";
import { UserContext } from "../App";

const TopBar = () => {
  const userContext = useContext(UserContext);
  const user = userContext?.user;

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-end px-8 sticky top-0 z-10 w-full">
      <div className="flex items-center space-x-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-gray-900">
            {user?.name || "User"}
          </p>
          <p className="text-xs text-gray-500">{user?.email || ""}</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
          <User size={20} />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
