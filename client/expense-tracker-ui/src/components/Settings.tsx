import React, { useEffect, useState, useContext } from "react";
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
import { authAPI } from "../services/api";
import { CURRENCIES, DATE_FORMATS } from "../constants";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { UserContext } from "../App";

interface SettingsFormData {
  currency: string;
  dateFormat: string;
  language: string;
  emailNotifications: boolean;
  budgetAlerts: boolean;
  theme: "light" | "dark";
}

const Settings = () => {
  const { register, handleSubmit, watch, setValue, reset } =
    useForm<SettingsFormData>({
      defaultValues: {
        currency: "USD",
        dateFormat: "DD/MM/YYYY",
        language: "en",
        emailNotifications: true,
        budgetAlerts: true,
        theme: "light",
      },
    });

  const theme = watch("theme");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const userContext = useContext(UserContext);

  // Instant theme preview while toggling buttons in the form
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Load settings on mount and apply theme
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await authAPI.getSettings();
        if (response.data?.settings) {
          const { settings } = response.data;
          reset({
            currency: settings.currency || "USD",
            dateFormat: settings.dateFormat || "DD/MM/YYYY",
            language: settings.language || "en",
            emailNotifications: settings.emailNotifications ?? true,
            budgetAlerts: settings.budgetAlerts ?? true,
            theme: settings.theme || "light",
          });
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };
    loadSettings();
  }, [reset]);

  const onSubmit = async (data: SettingsFormData) => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      await authAPI.updateSettings(data);
      setSaveMessage("Settings saved successfully!");

      // Update the global user context so other components reflect the new settings
      if (userContext) {
        userContext.updateUser({ settings: data });
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      setSaveMessage("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await authAPI.deleteAccount();
      setShowDeleteModal(false);
      // Redirect to login or home page
      window.location.href = "/login";
    } catch (error) {
      console.error("Failed to delete account:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto pb-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
          <SettingsIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Manage your preferences and account settings.
          </p>
        </div>
      </div>

      {saveMessage && (
        <div
          className={`p-4 rounded-lg ${
            saveMessage.includes("success")
              ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
          }`}
        >
          {saveMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Preferences Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-2">
            <Globe className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              General Preferences
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" /> Currency
              </label>
              <select
                {...register("currency")}
                className="block w-full px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all sm:text-sm"
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} ({currency.symbol}) - {currency.country}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-2" /> Date Format
              </label>
              <select
                {...register("dateFormat")}
                className="block w-full px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all sm:text-sm"
              >
                {DATE_FORMATS.map((format) => (
                  <option key={format.value} value={format.value}>
                    {format.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-2">
            <Bell className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Notifications
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  Email Notifications
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Receive weekly summaries and reports via email.
                </p>
              </div>
              <input
                type="checkbox"
                {...register("emailNotifications")}
                className="h-5 w-10 appearance-none bg-gray-200 dark:bg-gray-600 checked:bg-indigo-600 rounded-full relative transition-all duration-200 cursor-pointer before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-5 before:transition-all"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  Budget Alerts
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Get notified when you approach or exceed your budget limits.
                </p>
              </div>
              <input
                type="checkbox"
                {...register("budgetAlerts")}
                className="h-5 w-10 appearance-none bg-gray-200 dark:bg-gray-600 checked:bg-indigo-600 rounded-full relative transition-all duration-200 cursor-pointer before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-5 before:transition-all"
              />
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-2">
            <Eye className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Appearance
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setValue("theme", "light")}
                className={`p-4 border-2 rounded-xl flex items-center justify-center space-x-3 transition-all ${
                  theme === "light"
                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                    : "border-gray-100 dark:border-gray-600 hover:border-gray-200 dark:hover:border-gray-500 text-gray-500 dark:text-gray-400"
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
                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                    : "border-gray-100 dark:border-gray-600 hover:border-gray-200 dark:hover:border-gray-500 text-gray-500 dark:text-gray-400"
                }`}
              >
                <Moon className="h-5 w-5" />
                <span className="font-bold text-sm">Dark Mode</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data & Management Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center space-x-2">
            <Database className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Data Management
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  Export Transactions
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Download all your income and expense data in CSV format.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-600 transition-all border border-gray-200 dark:border-gray-600"
              >
                <Download className="h-4 w-4 mr-2" /> Export
              </button>
            </div>
            <div className="pt-4 border-t border-gray-50 dark:border-gray-700 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-rose-600 dark:text-rose-400">
                  Delete Account
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Permanently delete your account and all associated data.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center px-4 py-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-lg text-sm font-bold hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-all border border-rose-100 dark:border-rose-800"
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete Account
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-70"
          >
            {isSaving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </form>

      {/* Delete Account Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action will permanently delete all your data including expenses, income, and budgets. This cannot be undone."
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Settings;
