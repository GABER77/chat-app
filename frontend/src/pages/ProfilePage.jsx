import { useState, useEffect } from "react";
import { authStore } from "../stores/authStore";
import { Camera } from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = authStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profileImage: null,
  });

  // For showing preview of the selected image
  const [selectedImg, setSelectedImg] = useState(null);

  // Load authUser data on mount/update
  useEffect(() => {
    if (authUser) {
      setFormData({
        name: authUser.name || "",
        email: authUser.email || "",
        profileImage: null,
      });

      if (authUser.profileImage) {
        setSelectedImg(authUser.profileImage);
      }
    }
  }, [authUser]);

  // Handle text input changes (name, email)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image selection
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, profileImage: file }));
    setSelectedImg(URL.createObjectURL(file)); // show preview
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh

    if (!formData.name.trim()) return toast.error("Name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return toast.error("Invalid email format");

    try {
      await updateProfile(formData);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.data?.message || "Failed to update profile"
      );
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-base-200">
      <div className="w-full max-w-md px-10 pt-7 mt-23 mb-7 bg-[#1F1F23] rounded-2xl shadow-xl">
        <h1 className="text-2xl font-semibold text-white">Profile</h1>
        <p className="mt-2 text-gray-400">Your profile information</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg ? selectedImg : "/default-avatar.jpg"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 border-yellow-600"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 bg-zinc-300 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
              >
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to change photo"}
            </p>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-[#2A2A31] text-white border border-gray-700 rounded px-3 py-2 focus:border-yellow-600 focus:outline-none"
              placeholder="John Doe"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[#2A2A31] text-white border border-gray-700 rounded px-3 py-2 focus:border-yellow-600 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          {/* Static Account Information */}
          <h2 className="text-lg font-medium mt-7 mb-3 text-white">
            Account Information
          </h2>
          <div className="flex items-center text-white justify-between mt-5 pb-4 border-b border-zinc-700">
            <span>Member Since</span>
            <span>{authUser.createdAt?.split("T")[0]}</span>
          </div>
          <div className="flex items-center text-white justify-between pb-1">
            <span>Account Status</span>
            <span className="text-green-500">Active</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUpdatingProfile}
            className="w-full cursor-pointer mt-1 mb-7 bg-yellow-600 hover:bg-yellow-700 text-black font-semibold py-2.5 rounded-md transition"
          >
            {isUpdatingProfile ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
