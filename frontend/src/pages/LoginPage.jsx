import { useState } from "react";
import { authStore } from "../stores/authStore";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const LoginPage = () => {
  const { login, isLogingIn } = authStore();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle input changes and update form state
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh

    const isValid = validateForm();
    if (isValid !== true) return; // prevent submission on validation fail

    try {
      await login(formData);
      toast.success("Welcome Back");
      navigate("/"); // redirect to home on success
    } catch (err) {
      toast.error(
        err?.response?.data?.data?.message || "Login failed. Please try again"
      );
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-base-200">
      {/* Container */}
      <div className="w-full max-w-md px-10 pt-10 mt-30 mb-15 bg-[#1F1F23] rounded-2xl shadow-xl">
        {/* Logo */}
        <div className="flex justify-center mb-3">
          <div className="bg-yellow-600 p-3 rounded-lg">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Headings */}
        <h2 className="text-3xl font-bold text-white text-center mb-2">
          Welcome Back
        </h2>
        <p className="text-sm text-gray-400 text-center mb-4">
          Sign in to your account
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Email input */}
          <div>
            <label className="block text-sm py-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[#2A2A31] text-white border border-gray-700 rounded px-3 py-2 focus:border-yellow-600 focus:outline-none"
            />
          </div>

          {/* Password input */}
          <div className="mt-4">
            <label className="block text-sm text-gray-300 py-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-[#2A2A31] text-white border border-gray-700 rounded px-3 py-2 focus:border-yellow-600 focus:outline-none"
              />
              {/* Show/hide password toggle */}
              <button
                type="button"
                className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-200 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <EyeOff className="size-5 text-base-content/40" />
                ) : (
                  <Eye className="size-5 text-base-content/40" />
                )}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLogingIn}
            className="w-full mt-5 bg-yellow-600 hover:bg-yellow-700 text-black cursor-pointer font-semibold py-2 rounded-md transition"
          >
            {isLogingIn ? "Loading..." : "Login"}
          </button>
        </form>

        {/* Redirect to login */}
        <p className="text-center text-sm text-gray-400 pt-7 pb-6">
          Don't have an account?
          <a href="/signup" className="text-yellow-500 hover:underline ml-1">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};
export default LoginPage;
