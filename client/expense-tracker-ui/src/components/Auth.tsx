import * as React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Wallet, Eye, EyeOff } from "lucide-react";
import { authAPI } from "../services/api";

interface AuthProps {
  mode: "login" | "register";
}

interface FormValues {
  email: string;
  password: string;
  confirmPassword?: string;
}

const Auth = ({ mode }: AuthProps) => {
  const isLogin = mode === "login";
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Redirect to dashboard if user is already logged in
  React.useEffect(() => {
    const checkSession = async () => {
      try {
        await authAPI.getCurrentUser();
        navigate("/dashboard");
      } catch (err) {
        /* Not logged in, stay on auth page */
      }
    };
    checkSession();
  }, [navigate]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      if (isLogin) {
        // Login
        await authAPI.login({
          email: data.email,
          password: data.password,
        });
        toast.success("Welcome back!");
        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        // Register
        const response = await authAPI.register({
          email: data.email,
          password: data.password,
          name: data.email.split("@")[0], // Use email prefix as name
        });
        toast.success(`Welcome ${response.data.user.name}! Please sign in.`);
        navigate("/login"); // Redirect to login as requested previously
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.msg ||
        error.response?.data?.errors?.[0]?.msg ||
        "Authentication failed";

      toast.error(errorMsg);
      console.error("Auth error:", error.response?.data || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[550px] border border-gray-100">
        {/* Left Side: Beautiful Content */}
        <div className="md:w-1/2 bg-indigo-600 p-12 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_50%_50%,#fff_0%,transparent_50%)]"></div>
          <div className="relative z-10 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Master Your <br /> Finances Today.
            </h1>
            <p className="text-indigo-100 text-lg max-w-xs leading-relaxed">
              Join thousands of users tracking their wealth journey with our
              elegant and intuitive tool.
            </p>
            <div className="pt-8 space-y-4">
              <div className="flex items-center space-x-3 text-indigo-50">
                <div className="h-2 w-2 bg-indigo-300 rounded-full"></div>
                <span className="font-medium text-base">
                  Real-time spending insights
                </span>
              </div>
              <div className="flex items-center space-x-3 text-indigo-50">
                <div className="h-2 w-2 bg-indigo-300 rounded-full"></div>
                <span className="font-medium text-base">
                  Smart budget recommendations
                </span>
              </div>
              <div className="flex items-center space-x-3 text-indigo-50">
                <div className="h-2 w-2 bg-indigo-300 rounded-full"></div>
                <span className="font-medium text-base">
                  Bank-grade security standards
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-white">
          <div className="flex items-center space-x-3 text-indigo-600 mb-8">
            <Wallet className="h-8 w-8" />
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              SpendWise
            </span>
          </div>

          <div className="mb-10 text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-gray-500 font-medium">
              {isLogin
                ? "Please enter your details to sign in."
                : "Sign up to start tracking your journey."}
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

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className={`block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all sm:text-sm ${
                    errors.password
                      ? "border-red-500 ring-2 ring-red-500/10"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-500 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirmPassword", {
                      required: "Confirm password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                      validate: (value) =>
                        value === getValues("password") ||
                        "Passwords must match",
                    })}
                    className={`block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all sm:text-sm ${
                      errors.confirmPassword
                        ? "border-red-500 ring-2 ring-red-500/10"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-500 font-medium">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            )}

            {isLogin && (
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            <div>
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
                    Processing...
                  </div>
                ) : isLogin ? (
                  "Sign in"
                ) : (
                  "Create account"
                )}
              </button>
            </div>
          </form>

          <div className="mt-10 text-center text-sm text-gray-600 font-medium">
            {isLogin ? (
              <>
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-indigo-600 hover:text-indigo-500 hover:underline transition-colors"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-indigo-600 hover:text-indigo-500 hover:underline transition-colors"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>

          <div className="mt-auto pt-10 text-center">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Designed and developed by
              <br />
              <span className="text-indigo-600">Krishna Gautam</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
