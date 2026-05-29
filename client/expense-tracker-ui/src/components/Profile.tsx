import React from "react";
import { useForm } from "react-hook-form";
import {
  User,
  Mail,
  Camera,
  Key,
  Save,
  Briefcase,
  Calendar,
  ShieldCheck,
  CircleUser,
} from "lucide-react";

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

const Profile = () => {
  // Mock current user data - in a real app this comes from Context/API
  const user = {
    fullName: "Krishna",
    email: "krishna@example.com",
    bio: "Passionate about financial literacy and building cool tools.",
    jobTitle: "Software Engineer",
    joinedDate: "January 2024",
  };

  const {
    register: registerInfo,
    handleSubmit: handleSubmitInfo,
    formState: { errors: infoErrors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      fullName: user.fullName,
      email: user.email,
      bio: user.bio,
      jobTitle: user.jobTitle,
    },
  });

  const {
    register: registerPass,
    handleSubmit: handleSubmitPass,
    formState: { errors: passErrors },
    watch,
  } = useForm<PasswordFormData>();

  const onUpdateInfo = (data: ProfileFormData) => {
    console.log("Updating profile info:", data);
  };

  const onUpdatePassword = (data: PasswordFormData) => {
    console.log("Updating password:", data);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto pb-12">
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
                {user.fullName}
              </h1>
              <p className="text-gray-500 font-medium">{user.jobTitle}</p>
            </div>
            <div className="hidden md:flex space-x-4 mb-2">
              <div className="text-center px-4 border-r border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase">
                  Joined
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {user.joinedDate}
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
            <h3 className="text-lg font-bold text-gray-900">About Me</h3>
            <p className="text-sm text-gray-600 leading-relaxed italic">
              "{user.bio}"
            </p>
            <div className="pt-4 space-y-3">
              <div className="flex items-center text-sm text-gray-600 font-medium">
                <Mail className="h-4 w-4 mr-3 text-indigo-500" />
                {user.email}
              </div>
              <div className="flex items-center text-sm text-gray-600 font-medium">
                <Briefcase className="h-4 w-4 mr-3 text-indigo-500" />
                {user.jobTitle}
              </div>
              <div className="flex items-center text-sm text-gray-600 font-medium">
                <Calendar className="h-4 w-4 mr-3 text-indigo-500" />
                Joined {user.joinedDate}
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
                    className="block w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all sm:text-sm"
                  />
                  {infoErrors.email && (
                    <p className="mt-1 text-xs text-red-500">
                      {infoErrors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  {...registerInfo("jobTitle")}
                  className="block w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  {...registerInfo("bio")}
                  rows={3}
                  className="block w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all sm:text-sm"
                />
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                >
                  <Save className="h-4 w-4 mr-2" />
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
                <input
                  type="password"
                  placeholder="••••••••"
                  {...registerPass("currentPassword", {
                    required: "Current password is required",
                  })}
                  className="block w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all sm:text-sm"
                />
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
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...registerPass("newPassword", {
                      required: "New password is required",
                      minLength: { value: 6, message: "Min 6 characters" },
                    })}
                    className="block w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all sm:text-sm"
                  />
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
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...registerPass("confirmPassword", {
                      required: "Please confirm",
                      validate: (val) =>
                        watch("newPassword") === val ||
                        "Passwords do not match",
                    })}
                    className="block w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all sm:text-sm"
                  />
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
                  className="inline-flex items-center px-6 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-md"
                >
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
