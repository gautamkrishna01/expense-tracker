import * as React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await authAPI.forgotPassword(data.email);
      toast.success("Recovery link sent to your email!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.msg ||
        error.response?.data?.errors?.[0]?.msg ||
        "Failed to send recovery link";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[550px] border border-gray-100">
        <div className="md:w-1/2 bg-indigo-600 p-12 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_50%_50%,#fff_0%,transparent_50%)]"></div>
          <div className="relative z-10 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Lost Your <br /> Way?
            </h1>
            <p className="text-indigo-100 text-lg max-w-xs leading-relaxed">
              Don't worry, it happens to the best of us. Let's get you back into
              your account.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-white">
          <div className="mb-10 text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Forgot password
            </h2>
            <p className="text-gray-500 font-medium">
              Enter your email and we'll send you a recovery link.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Enter a valid email address",
                  },
                })}
                className={`block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all sm:text-sm ${
                  errors.email ? "border-red-500 ring-2 ring-red-500/10" : ""
                }`}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-500 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-md shadow-indigo-200 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </div>
              ) : (
                "Send recovery link"
              )}
            </button>
          </form>

          <div className="mt-10 text-center text-sm text-gray-600 font-medium">
            <Link
              to="/login"
              className="font-bold text-indigo-600 hover:text-indigo-500 hover:underline transition-colors"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;
