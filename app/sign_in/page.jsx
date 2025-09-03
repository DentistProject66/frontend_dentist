"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../../lib/auth";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function SignIn() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await loginUser({ email: form.email, password: form.password });
      console.log("Login response:", result); // Debug response
      if (result.success) {
        const { token, user } = result.data.data;
        if (!token || !user) {
          throw new Error("Invalid response: token or user data missing");
        }
        // Store token and user info in localStorage
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        console.log("Stored user:", user); // Debug stored user
        const role = user.role;
        console.log("User role:", role); // Debug role
        if (role === "super_admin" || role === "admin") {
          router.push("/admin/approval");
        } else if (["dentist", "assistant"].includes(role)) {
          router.push("/consultations");
        } else {
          setError("Unknown role. Please contact support.");
        }
      } else {
        setError(result.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error or invalid response. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-100 flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: 'url("/maghnia.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative z-10 bg-white rounded-xl shadow-xl p-8 w-full max-w-sm mx-4">
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-blue-600 mb-4" style={{ color: "#2E86AB" }}>
            ✱.logo
          </div>
          <h1 className="text-xl font-semibold text-gray-800 mb-1">Sign in to your account</h1>
          <p className="text-gray-500 text-sm">Welcome back! Please enter your details.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                disabled={loading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                disabled={loading}
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm hover:underline" style={{ color: "#2E86AB" }}>
              Forgot your password?
            </a>
          </div>

          <button
            type="button"
            onClick={handleLogin}
            className="w-full text-white font-medium py-2.5 px-4 rounded-md hover:opacity-90 transition-opacity text-sm"
            style={{ backgroundColor: "#2E86AB" }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
          <div className="text-center pt-1">
            <span className="text-xs text-gray-600">
              You don&apos;t have an account?{" "}
              <a href="/signup" className="hover:underline font-medium" style={{ color: "#2E86AB" }}>
                Sign up
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}