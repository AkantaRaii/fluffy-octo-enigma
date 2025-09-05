"use client";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Department } from "@/types/Depertment";
import apiClient from "@/utils/axiosClient";
import { AlertTriangle } from "lucide-react";

// TailwindCSS required. Framer Motion: `npm i framer-motion`
// Ensure <ToastContainer /> is mounted in your root layout for react-toastify.
interface Props {
  departments: Department[];
}
export default function RegisterForm({ departments }: Props) {
  const router = useRouter();
  const [emailRegistered, setEmailRegistered] = useState(false);

  const steps = [
    { id: 1, title: "Basic Info" },
    { id: 2, title: "Department" },
    { id: 3, title: "Confirm" },
  ] as const;

  const [step, setStep] = useState<number>(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "", // for USER
    lastName: "", // for USER
    department: 0, // for USER
    agreeTos: false,
  });

  const emailValid = useMemo(
    () => /\S+@\S+\.\S+/.test(form.email),
    [form.email]
  );
  const passwordValid = useMemo(
    () => form.password.length >= 6,
    [form.password]
  );
  const passwordsMatch = useMemo(
    () => form.password === form.confirmPassword,
    [form.password, form.confirmPassword]
  );

  const step1Valid = emailValid && passwordValid && passwordsMatch;
  const step2Valid = true;
  // form.role === "USER"
  //   ? form.fullName.trim().length > 1 && form.department.trim().length > 1
  //   : form.orgName.trim().length > 1;
  const step3Valid = form.agreeTos;

  const canGoNext =
    step === 1
      ? step1Valid
      : step === 2
      ? step2Valid
      : step === 3
      ? step3Valid
      : false;

  const percent = ((step - 1) / (steps.length - 1)) * 100;

  const variants = {
    enter: (d: 1 | -1) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: 1 | -1) => ({ x: d > 0 ? -40 : 40, opacity: 0 }),
  };

  const next = async () => {
    if (step === 1) {
      if (!step1Valid) return;

      try {
        setSubmitting(true);
        // Call your API to check if email exists
        const res = await apiClient.post("/api/v1/auth/check-email/", {
          email: form.email,
        });
        const response = res.data;
        if (response.exists) {
          toast.error("Email is already registered.");
          setSubmitting(false);
          setEmailRegistered(true);
          return; // Don't go to next step
        }
        console.log("check email");
      } catch {
        toast.error("Error checking email.");
        setSubmitting(false);
        return;
      } finally {
        setSubmitting(false);
      }
    }

    // Move to next step if all good
    if (step < steps.length) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  };

  const back = () => {
    if (step > 1) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!step3Valid) return;
    setSubmitting(true);
    const payload = {
      email: form.email,
      password: form.password,
      first_name: form.firstName,
      last_name: form.lastName,
      department: form.department,
    };
    const res = await apiClient.post("/api/v1/auth/users/", payload);
    const responseData = res.data;
    if (res.status !== 201) {
      toast.error(responseData?.message || "Registration failed. Try again.");
      setSubmitting(false);
      return;
    }
    console.log(payload);
    router.push(`/register/verify?email=${encodeURIComponent(payload.email)}`);
  }

  return (
    <div className="max-w-xl mx-auto p-6 ">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Create your account</h1>
        <p className="text-gray-500 mt-1">Complete the steps to get started.</p>
      </div>

      {/* Stepper */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          {steps.map((s) => (
            <div key={s.id} className="flex flex-col items-center flex-1">
              <div
                className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold shadow-sm border ${
                  step >= s.id
                    ? "bg-theme text-white border-theme"
                    : "bg-white text-gray-500 border-gray-300"
                }`}
              >
                {s.id}
              </div>
              <span
                className={`mt-1 text-xs ${
                  step === s.id ? "font-medium" : "text-gray-500"
                }`}
              >
                {s.title}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-theme transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow p-6">
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait" custom={direction}>
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-xl font-semibold mb-4">Basic Info</h2>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 h-10 focus:outline-none focus:ring-2 focus:ring-theme"
                      value={form.email}
                      onChange={(e) => {
                        setForm({ ...form, email: e.target.value });
                        setEmailRegistered(false);
                      }}
                      placeholder="you@example.com"
                      required
                    />
                    {/* Validation messages */}
                    <div className="mt-1 space-y-1">
                      {!emailValid && form.email.length > 0 && (
                        <div className="flex items-center text-red-600 text-xs font-medium bg-red-50 border border-red-200 rounded px-2 py-1">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Please enter a valid email
                        </div>
                      )}
                      {emailRegistered && (
                        <div className="flex items-center text-red-600 text-xs font-medium bg-red-50 border border-red-200 rounded px-2 py-1">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Email already registered
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 h-10 pr-10 focus:outline-none focus:ring-2 focus:ring-theme"
                        value={form.password}
                        onChange={(e) =>
                          setForm({ ...form, password: e.target.value })
                        }
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    {!passwordValid && form.password.length > 0 && (
                      <p className="text-xs text-red-600 mt-1">
                        Use at least 6 characters.
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirm"
                      className="block text-sm font-medium"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirm"
                        type={showConfirm ? "text" : "password"}
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 h-10 pr-10 focus:outline-none focus:ring-2 focus:ring-theme"
                        value={form.confirmPassword}
                        onChange={(e) =>
                          setForm({ ...form, confirmPassword: e.target.value })
                        }
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((s) => !s)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600"
                      >
                        {showConfirm ? "Hide" : "Show"}
                      </button>
                    </div>
                    {!passwordsMatch && form.confirmPassword.length > 0 && (
                      <p className="text-xs text-red-600 mt-1">
                        Passwords do not match.
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-xl font-semibold mb-4">Role & Details</h2>

                <div className="space-y-4">
                  {/* First + Last Name in a row */}
                  <div className="flex flex-row gap-4">
                    <div className="flex-1">
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium"
                      >
                        First Name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 h-10 focus:outline-none focus:ring-2 focus:ring-theme"
                        value={form.firstName}
                        onChange={(e) =>
                          setForm({ ...form, firstName: e.target.value })
                        }
                        placeholder="Your first name"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium"
                      >
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 h-10 focus:outline-none focus:ring-2 focus:ring-theme"
                        value={form.lastName}
                        onChange={(e) =>
                          setForm({ ...form, lastName: e.target.value })
                        }
                        placeholder="Your last name"
                        required
                      />
                    </div>
                  </div>
                  {/* Department */}
                  <div className="flex-1">
                    <label
                      htmlFor="department"
                      className="block text-sm font-medium"
                    >
                      Department
                    </label>
                    <select
                      id="department"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 h-10 focus:outline-none focus:ring-2 focus:ring-theme"
                      value={form.department}
                      onChange={(e) =>
                        setForm({ ...form, department: Number(e.target.value) })
                      }
                      required
                    >
                      <option value={0} disabled>
                        Select your department
                      </option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-xl font-semibold mb-4">Review & Confirm</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Email</span>
                    <span className="font-medium">{form.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Name</span>
                    <span className="font-medium">
                      {form.firstName} {form.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Department</span>
                    <span className="font-medium">
                      {departments.find((d) => d.id === form.department)
                        ?.name || "—"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-2">
                  <input
                    id="tos"
                    type="checkbox"
                    checked={form.agreeTos}
                    onChange={(e) =>
                      setForm({ ...form, agreeTos: e.target.checked })
                    }
                    className="mt-1"
                  />
                  <label htmlFor="tos" className="text-sm text-gray-700">
                    I agree to the{" "}
                    <a href="#" className="underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer actions */}
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={back}
              disabled={step === 1}
              className="px-4 h-10 rounded-xl border border-gray-300 disabled:opacity-50 hover:cursor-pointer"
            >
              Back
            </button>

            {step < steps.length ? (
              <button
                type="button"
                onClick={next}
                disabled={!canGoNext}
                className="px-5 h-10 rounded-xl bg-theme text-white disabled:opacity-50 hover:cursor-pointer"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={!canGoNext || submitting}
                className={`px-5 h-10 rounded-xl bg-theme text-white disabled:opacity-50 hover:cursor-pointer ${
                  submitting ? "opacity-70" : ""
                }`}
              >
                {submitting ? "Creating ...." : "Create Account"}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Helper text */}
      <p className="text-center text-sm text-gray-600 mt-4">
        Already have an account?{" "}
        <a href="/login" className="underline">
          Sign in
        </a>
      </p>
    </div>
  );
}
