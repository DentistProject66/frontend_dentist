"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../../lib/auth"; // Adjust path as needed

export default function SignUp() {
  const router = useRouter();

  const data = [
    { name: "email", id: 3, form_name: "email", type: "email", placeholder: "your.email@example.com" },
    { name: "password", id: 4, form_name: "password", type: "password", placeholder: "••••••••" },
    { name: "phone", id: 5, form_name: "phone", type: "tel", placeholder: "+1 (555) 000-0000" },
    { name: "practice_name", id: 6, form_name: "practice_name", type: "text", placeholder: "Practice name" },
  ];

  const [form, setForm] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    role: "",
    practice_name: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State for success modal

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const { email, password, first_name, last_name, phone, role, practice_name } = form;

    if (!email || !password || !first_name || !last_name || !phone || !role || !practice_name) {
      setError("All fields are required");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const result = await registerUser(form);

    if (result.success) {
      console.log("Registration successful:", result.data);
      setShowSuccessModal(true); // Show modal instead of alert
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  const closeModalAndRedirect = () => {
    setShowSuccessModal(false);
    router.push("/sign_in");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: 'url("/maghnia.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Sign Up Card - Centered */}
      <div className="relative z-10 bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4 my-8">
        {/* Logo */}
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-blue-600 mb-3" style={{ color: "#2E86AB" }}>
            ✱.logo
          </div>
          <h1 className="text-lg font-semibold text-gray-800 mb-1">Create your account</h1>
          <p className="text-gray-500 text-xs">Welcome! Please fill in your details.</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-xs">{error}</p>
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-3">
          {/* First Name and Last Name Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">First Name *</label>
              <input
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                placeholder="First name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Last Name *</label>
              <input
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                placeholder="Last name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs"
                disabled={loading}
              />
            </div>
          </div>

          {/* Dynamic Fields */}
          {data.map((item) => (
            <div key={item.id}>
              <label className="block text-xs font-medium text-gray-700 mb-1 capitalize">
                {item.form_name.replace("_", " ")} *
              </label>
              <div className="relative">
                <input
                  type={item.form_name === "password" ? (showPassword ? "text" : "password") : item.type}
                  name={item.form_name}
                  value={form[item.form_name]}
                  onChange={handleChange}
                  placeholder={item.placeholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs"
                  disabled={loading}
                />
                {item.form_name === "password" && (
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Role Field */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Role *</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs appearance-none bg-white"
              disabled={loading}
            >
              <option value="">Select role</option>
              <option value="dentist">Dentist</option>
              <option value="assistant">Assistant</option>
            </select>
          </div>

          {/* Sign Up Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full text-white font-medium my-2 py-2.5 px-4 rounded-md transition-opacity text-xs ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-90 cursor-pointer"
            }`}
            style={{ backgroundColor: "#2E86AB" }}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          {/* Sign In Link */}
          <div className="text-center pt-1">
            <span className="text-xs text-gray-600">
              Already have an account?{" "}
              <a href="/sign_in" className="hover:underline font-medium" style={{ color: "#2E86AB" }}>
                Sign in
              </a>
            </span>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Registration Successful!</h2>
            <p className="text-gray-600 text-sm mb-6">
              Please wait for admin approval before signing in.
            </p>
            <button
              onClick={closeModalAndRedirect}
              className="w-full text-white font-medium py-2 px-4 rounded-md hover:opacity-90 text-sm"
              style={{ backgroundColor: "#2E86AB" }}
            >
              Go to Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}