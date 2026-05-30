import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import {
  User,
  Mail,
  Camera,
  Eye,
  EyeOff,
  Key,
  Save,
  Calendar,
  ShieldCheck,
  CircleUser,
  Loader2,
} from "lucide-react";
import { authAPI } from "../services/api";
import { UserContext } from "../App";

interface ProfileFormData {
  fullName: string;
  email: string;
  bio?: string;
  jobTitle?: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface UserData {
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

// Toast component
const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all ${
        type === "success"
          ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
          : "bg-red-50 border border-red-200 text-red-700"
      }`}
    >
      {message}
    </div>
  );
};

const Profile = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const userContext = useContext(UserContext);

  const {
    register: registerInfo,
    handleSubmit: handleSubmitInfo,
    formState: { errors: infoErrors },
    reset: resetInfo,
  } = useForm<ProfileFormData>();

  const {
    register: registerPass,
    handleSubmit: handleSubmitPass,
    formState: { errors: passErrors },
    watch,
    reset: resetPass,
  } = useForm<PasswordFormData>();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    setLoading(true);
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data);
      resetInfo({
        fullName: response.data.name,
        email: response.data.email,
      });
    } catch (err) {
      setToast({ message: "Failed to load user data", type: "error" });
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  };

  const onUpdateInfo = async (data: ProfileFormData) => {
    setUpdating(true);
    try {
      const response = await authAPI.updateProfile({
        name: data.fullName,
        email: data.email,
      });
      setUser(response.data.user);
      // Update the context to refresh TopBar
      if (userContext) {
        userContext.updateUser(response.data.user);
      }
      setToast({ message: "Profile updated successfully", type: "success" });
    } catch (err) {
      const error = err as { response?: { data?: { msg?: string } } };
      setToast({
        message: error.response?.data?.msg || "Failed to update profile",
        type: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  const onUpdatePassword = async (data: PasswordFormData) => {
    setPasswordUpdating(true);
    try {
      await authAPI.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setToast({ message: "Password updated successfully", type: "success" });
      resetPass();
    } catch (err) {
      const error = err as { response?: { data?: { msg?: string } } };
      setToast({
        message: error.response?.data?.msg || "Failed to update password",
        type: "error",
      });
    } finally {
      setPasswordUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto pb-12">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12">
            <div className="relative">
              <div className="h-24 w-24 rounded-2xl bg-white p-1 shadow-md">
                <div className="h-full w-full rounded-xl bg-gray-100 flex items-center justify-center text-indigo-600">
                  <CircleUser className="h-16 w-16" />
                </div>
              </div>
              <button className="absolute -bottom-2 -right-2 p-1.5 bg-indigo-600 rounded-lg text-white shadow-lg border-2 border-white hover:bg-indigo-700 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 ml-6 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {user?.name || "User"}
              </h1>
              <p className="text-gray-500 font-medium">{user?.email}</p>
            </div>
            <div className="hidden md:flex space-x-4 mb-2">
              <div className="text-center px-4 border-r border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase">
                  Joined
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
              <div className="text-center px-4">
                <p className="text-xs font-bold text-gray-400 uppercase">
                  Status
                </p>
                <div className="flex items-center text-emerald-600 text-sm font-bold">
                  <ShieldCheck className="h-3 w-3 mr-1" /> Verified
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Account Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Account Details</h3>
            <div className="pt-4 space-y-3">
              <div className="flex items-center text-sm text-gray-600 font-medium">
                <Mail className="h-4 w-4 mr-3 text-indigo-500" />
                {user?.email}
              </div>
              <div className="flex items-center text-sm text-gray-600 font-medium">
                <Calendar className="h-4 w-4 mr-3 text-indigo-500" />
                Member since{" "}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  : "N/A"}
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
            <h4 className="text-indigo-900 font-bold mb-2 text-sm">Pro Tip</h4>
            <p className="text-xs text-indigo-700 leading-relaxed">
              Keeping your profile details updated helps us provide more
              personalized financial insights.
            </p>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information Form */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-6">
              <User className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-gray-900">
                Basic Information
              </h3>
            </div>

            <form
              onSubmit={handleSubmitInfo(onUpdateInfo)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    {...registerInfo("fullName", {
                      required: "Name is required",
                    })}
                    defaultValue={user?.name || ""}
                    className="block w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all sm:text-sm"
                  />
                  {infoErrors.fullName && (
                    <p className="mt-1 text-xs text-red-500">
                      {infoErrors.fullName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    {...registerInfo("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email",
                      },
                    })}
                    defaultValue={user?.email || ""}
                    className="block w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all sm:text-sm"
                  />
                  {infoErrors.email && (
                    <p className="mt-1 text-xs text-red-500">
                      {infoErrors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={updating}
                  className="inline-flex items-center px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 disabled:opacity-50"
                >
                  {updating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Password Reset Form */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center space-x-2 mb-6">
              <Key className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-gray-900">
                Security & Password
              </h3>
            </div>

            <form
              onSubmit={handleSubmitPass(onUpdatePassword)}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...registerPass("currentPassword", {
                      required: "Current password is required",
                    })}
                    className="block w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {passErrors.currentPassword && (
                  <p className="mt-1 text-xs text-red-500">
                    {passErrors.currentPassword.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...registerPass("newPassword", {
                        required: "New password is required",
                        minLength: { value: 6, message: "Min 6 characters" },
                      })}
                      className="block w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      {showNewPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  {passErrors.newPassword && (
                    <p className="mt-1 text-xs text-red-500">
                      {passErrors.newPassword.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...registerPass("confirmPassword", {
                        required: "Please confirm",
                        validate: (val) =>
                          watch("newPassword") === val ||
                          "Passwords do not match",
                      })}
                      className="block w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  {passErrors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">
                      {passErrors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={passwordUpdating}
                  className="inline-flex items-center px-6 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-md disabled:opacity-50"
                >
                  {passwordUpdating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
