"use client";
import { useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";
import apiClient from "@/utils/axiosClient";
import { AxiosError } from "axios";
export default function InputField() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false); // toggle login/reset
  const router = useRouter();

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (response?.ok) {
        toast.success("Logged in successfully!");
        router.push(callbackUrl);
      } else {
        toast.error(response?.error || "Invalid credentials");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      const res = await apiClient.post(
        "api/v1/auth/users/forgot-password/request/",
        { email }
      );

      // success
      if (res.status === 200) {
        toast.success(res.data.message); // optional
        router.push(`/login/verify?email=${encodeURIComponent(email)}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="h-[500px] my-22 sm:mx-12 md:mx-15 mx-2 flex flex-col items-center p-4">
      {!forgotMode ? (
        // ===================== LOGIN FORM =====================
        <form onSubmit={submitHandler} className="w-full">
          <h1 className="text-primaryText font-bold text-3xl m-2">
            Welcome Back!
          </h1>
          <p className="text-secondaryText my-2 w-full text-center">
            Sign in securely to your greentik Exam Account.
          </p>

          {/* Email */}
          <div className="w-full flex flex-col py-1 my-3">
            <label htmlFor="email" className="text-sm font-medium text-black">
              Email*
            </label>
            <input
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-md w-full h-10 my-1 bg-gray-50 px-3"
              type="email"
              placeholder="example@domain.com"
              required
            />
          </div>

          {/* Password */}
          <div className="w-full flex flex-col py-1 my-3">
            <label
              htmlFor="password"
              className="text-sm font-medium text-black"
            >
              Password*
            </label>
            <div className="relative w-full">
              <input
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 rounded-md w-full h-10 my-1 bg-gray-50 px-3"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
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
          </div>

          {/* Forgot password */}
          <div className="w-full flex flex-row justify-end underline text-sm text-warningAction">
            <button
              title="Reset Password"
              type="button"
              className="hover:cursor-pointer"
              onClick={() => setForgotMode(true)}
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-theme text-white w-full h-10 my-3 py-2 hover:opacity-80 hover:scale-105 transform duration-75 disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          {/* Divider */}
          <div className="w-full flex flex-row gap-4 items-center text-sm text-gray-500 py-2">
            <hr className="flex-1 border-t border-gray-300" />
            <p>Or</p>
            <hr className="flex-1 border-t border-gray-300" />
          </div>

          {/* Register */}
          <div className="text-center">
            Don&apos;t have an account yet?{" "}
            <Link href="/register">
              <span className="text-theme underline">Sign up</span>
            </Link>
          </div>
        </form>
      ) : (
        // ===================== RESET FORM =====================
        <form onSubmit={resetHandler} className="w-full">
          <h1 className="text-primaryText font-bold text-2xl m-2">
            Reset Password
          </h1>
          <p className="text-secondaryText text-sm mb-4 text-center">
            Enter the email linked to your account. We will help you reset your
            password.
          </p>

          {/* Email input for reset */}
          <div className="w-full flex flex-col py-1 my-3">
            <label
              htmlFor="resetEmail"
              className="text-sm font-medium text-black"
            >
              Email*
            </label>
            <input
              id="resetEmail"
              name="resetEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-md w-full h-10 my-1 bg-gray-50 px-3"
              type="email"
              placeholder="example@domain.com"
              required
            />
          </div>

          <button
            type="submit"
            className="rounded-md bg-theme text-white w-full h-10 my-3 py-2 hover:opacity-80 hover:scale-105 transform duration-75"
          >
            Continue
          </button>

          <button
            type="button"
            onClick={() => setForgotMode(false)}
            className="rounded-md bg-gray-600 text-white w-full h-10 my-3 py-2 hover:opacity-80 hover:scale-105 transform duration-75"
          >
            Back to Login
          </button>
        </form>
      )}
    </div>
  );
}
