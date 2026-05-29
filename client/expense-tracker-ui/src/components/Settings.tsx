import React from "react";
import { useForm } from "react-hook-form";
import {
  Settings as SettingsIcon,
  Globe,
  Bell,
  Eye,
  Database,
  Trash2,
  DollarSign,
  Calendar,
  Moon,
  Sun,
  Download,
} from "lucide-react";

interface SettingsFormData {
  currency: string;
  dateFormat: string;
  language: string;
  emailNotifications: boolean;
  budgetAlerts: boolean;
  theme: "light" | "dark";
}

const Settings = () => {
  const { register, handleSubmit, watch, setValue } = useForm<SettingsFormData>(
    {
      defaultValues: {
        currency: "USD",
        dateFormat: "DD/MM/YYYY",
        language: "en",
        emailNotifications: true,
        budgetAlerts: true,
        theme: "light",
      },
    }
  );

  const theme = watch("theme");

  const onSubmit = (data: SettingsFormData) => {
    console.log("Saving settings:", data);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto pb-12">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <SettingsIcon className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 font-medium">
            Manage your preferences and account settings.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Preferences Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center space-x-2">
            <Globe className="h-5 w-5 text-indigo-500" />
            <h3 className="text-lg font-bold text-gray-900">
              General Preferences
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" /> Currency
              </label>
              <select
                {...register("currency")}
                className="block w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all sm:text-sm"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-2" /> Date Format
              </label>
              <select
                {...register("dateFormat")}
                className="block w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all sm:text-sm"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center space-x-2">
            <Bell className="h-5 w-5 text-indigo-500" />
            <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-900">
                  Email Notifications
                </p>
                <p className="text-xs text-gray-500">
                  Receive weekly summaries and reports via email.
                </p>
              </div>
              <input
                type="checkbox"
                {...register("emailNotifications")}
                className="h-5 w-10 appearance-none bg-gray-200 checked:bg-indigo-600 rounded-full relative transition-all duration-200 cursor-pointer before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-5 before:transition-all"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-900">Budget Alerts</p>
                <p className="text-xs text-gray-500">
                  Get notified when you approach or exceed your budget limits.
                </p>
              </div>
              <input
                type="checkbox"
                {...register("budgetAlerts")}
                className="h-5 w-10 appearance-none bg-gray-200 checked:bg-indigo-600 rounded-full relative transition-all duration-200 cursor-pointer before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-5 before:transition-all"
              />
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center space-x-2">
            <Eye className="h-5 w-5 text-indigo-500" />
            <h3 className="text-lg font-bold text-gray-900">Appearance</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setValue("theme", "light")}
                className={`p-4 border-2 rounded-xl flex items-center justify-center space-x-3 transition-all ${
                  theme === "light"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                    : "border-gray-100 hover:border-gray-200 text-gray-500"
                }`}
              >
                <Sun className="h-5 w-5" />
                <span className="font-bold text-sm">Light Mode</span>
              </button>
              <button
                type="button"
                onClick={() => setValue("theme", "dark")}
                className={`p-4 border-2 rounded-xl flex items-center justify-center space-x-3 transition-all ${
                  theme === "dark"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                    : "border-gray-100 hover:border-gray-200 text-gray-500"
                }`}
              >
                <Moon className="h-5 w-5" />
                <span className="font-bold text-sm">Dark Mode</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data & Management Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center space-x-2">
            <Database className="h-5 w-5 text-indigo-500" />
            <h3 className="text-lg font-bold text-gray-900">Data Management</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-900">
                  Export Transactions
                </p>
                <p className="text-xs text-gray-500">
                  Download all your income and expense data in CSV format.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-100 transition-all border border-gray-200"
              >
                <Download className="h-4 w-4 mr-2" /> Export
              </button>
            </div>
            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-rose-600">
                  Delete Account
                </p>
                <p className="text-xs text-gray-500">
                  Permanently delete your account and all associated data.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 bg-rose-50 text-rose-600 rounded-lg text-sm font-bold hover:bg-rose-100 transition-all border border-rose-100"
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete Account
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            Save All Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
