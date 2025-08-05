import { useState } from "react";
import { authStore } from "../stores/authStore";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const { signup, isSigningUp } = authStore();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  // Handle input changes and update form state
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!formData.name.trim()) return toast.error("Full Name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (!formData.passwordConfirm)
      return toast.error("password Confirm is required");
    if (!passwordRegex.test(formData.password))
      return toast.error(
        "Password must be at least 8 characters, include one uppercase letter and one special character"
      );
    if (formData.password !== formData.passwordConfirm)
      return toast.error("Passwords do not match");

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh

    const isValid = validateForm();
    if (isValid !== true) return; // prevent submission on validation fail

    try {
      await signup(formData);
      toast.success("Account created successfully");
      navigate("/"); // redirect to home on success
    } catch {
      toast.error("Signup failed. Please try again");
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-base-200">
      {/* Container */}
      <div className="w-full max-w-md px-10 pt-7 mt-23 mb-7 bg-[#1F1F23] rounded-2xl shadow-xl">
        {/* Logo */}
        <div className="flex justify-center mb-3">
          <div className="bg-yellow-600 p-3 rounded-lg">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Headings */}
        <h2 className="text-3xl font-bold text-white text-center mb-2">
          Create Account
        </h2>
        <p className="text-sm text-gray-400 text-center mb-3">
          It's free and always will be
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Name input */}
          <div>
            <label className="block text-sm py-2">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-[#2A2A31] text-white border border-gray-700 rounded px-3 py-2 focus:border-yellow-600 focus:outline-none"
            />
          </div>

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
          <div>
            <label className="block text-sm text-gray-300 py-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-[#2A2A31] text-white border border-gray-700 rounded px-3 py-2 pr-10 focus:border-yellow-600 focus:outline-none"
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

          {/* Password Confirm input */}
          <div>
            <label className="block text-sm text-gray-300 py-2">
              Password Confirm
            </label>
            <div className="relative pb-3">
              <input
                type={showPassword ? "text" : "password"}
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-[#2A2A31] text-white border border-gray-700 rounded px-3 py-2 pr-10 focus:border-yellow-600 focus:outline-none"
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
            disabled={isSigningUp}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-black cursor-pointer font-semibold py-2 rounded-md transition"
          >
            {isSigningUp ? "Loading..." : "Sign Up"}
          </button>
        </form>

        {/* Redirect to login */}
        <p className="text-center text-sm text-gray-400 pt-5 pb-6">
          Already have an account?
          <a href="/login" className="text-yellow-500 hover:underline ml-1">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
