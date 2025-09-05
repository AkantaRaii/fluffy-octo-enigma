"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import apiClient from "@/utils/axiosClient";

export default function ChangePasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <h1 className="text-2xl font-bold text-red-600">Invalid Link</h1>
        <p className="text-gray-600 mt-2">
          The password reset link is missing or expired.
        </p>
      </div>
    );
  }

  // password strength validation rules
  const passwordErrors = [];
  if (newPassword.length > 0 && newPassword.length < 8) {
    passwordErrors.push("At least 8 characters");
  }
  if (newPassword.length > 0 && !/[A-Z]/.test(newPassword)) {
    passwordErrors.push("At least 1 uppercase letter");
  }
  if (newPassword.length > 0 && !/[a-z]/.test(newPassword)) {
    passwordErrors.push("At least 1 lowercase letter");
  }
  if (newPassword.length > 0 && !/[0-9]/.test(newPassword)) {
    passwordErrors.push("At least 1 number");
  }

  const passwordsMatch =
    newPassword.length > 0 && confirmPassword.length > 0
      ? newPassword === confirmPassword
      : true;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (passwordErrors.length > 0) {
      toast.error("Password does not meet requirements.");
      return;
    }

    if (!passwordsMatch) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // TODO: call backend API here
      const res = await apiClient.post(
        `api/v1/auth/users/forgot-password/confirm/`,
        {
          token: token,
          new_password: newPassword,
        }
      );
      if (res.status == 200) {
        toast.success("Password changed successfully!");
        router.push("/login");
      }
      toast.error("failed to change password");
    } catch {
      toast.error("Failed to reset password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-2 text-primaryText">
          Set a New Password
        </h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your new password below. Make sure it’s strong and something
          you’ll remember.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 h-10 px-3 bg-gray-50"
                placeholder="Enter new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Validation messages */}
            {passwordErrors.length > 0 && (
              <ul className="text-xs text-red-500 mt-1 list-disc list-inside">
                {passwordErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`mt-1 block w-full rounded-md border h-10 px-3 bg-gray-50 ${
                confirmPassword.length > 0 && !passwordsMatch
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Confirm new password"
              required
            />
            {!passwordsMatch && confirmPassword.length > 0 && (
              <p className="text-xs text-red-500 mt-1">
                Passwords do not match
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-theme text-white rounded-md h-10 hover:opacity-80 hover:scale-[1.02] transform duration-100 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
