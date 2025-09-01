"use client";

import { useState, useRef, useEffect } from "react";

interface OtpFormProps {
  title: string;
  description: string;
  logo?: string;
  length?: number; // default 6
  onSubmit: (otp: string) => void;
  onResend?: () => void;
  resendDelay?: number; // seconds
}

export default function OtpForm({
  title,
  description,
  logo,
  length = 6,
  onSubmit,
  onResend,
  resendDelay = 30,
}: OtpFormProps) {
  const [values, setValues] = useState(Array(length).fill(""));
  const [timer, setTimer] = useState(resendDelay);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown for resend
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value: string, idx: number) => {
    if (!/^\d?$/.test(value)) return; // only digits
    const newValues = [...values];
    newValues[idx] = value;
    setValues(newValues);

    // move to next input
    if (value && idx < length - 1) {
      inputs.current[idx + 1]?.focus();
    }

    // auto-submit when filled
    if (newValues.every((val) => val !== "")) {
      onSubmit(newValues.join(""));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Backspace" && !values[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowLeft" && idx > 0) {
      inputs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < length - 1) {
      inputs.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("Text").trim();
    if (!/^\d+$/.test(pasted)) return; // only digits
    const chars = pasted.slice(0, length).split("");
    const newValues = [...values];
    chars.forEach((char, i) => (newValues[i] = char));
    setValues(newValues);

    // focus last filled input
    const lastIdx = chars.length - 1;
    inputs.current[lastIdx]?.focus();

    // auto-submit if full
    if (newValues.every((val) => val !== "")) {
      onSubmit(newValues.join(""));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (values.every((val) => val !== "")) {
      onSubmit(values.join(""));
    }
  };

  const handleResend = () => {
    if (onResend) {
      onResend();
      setTimer(resendDelay);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-md border border-gray-100">
        {logo && (
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Logo" className="h-12" />
          </div>
        )}

        <h1 className="text-2xl font-bold text-gray-900 text-center">
          {title}
        </h1>
        <p className="text-gray-500 text-center mt-2">{description}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* OTP boxes */}
          <div className="flex justify-center gap-3">
            {values.map((val, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputs.current[idx] = el;
                }}
                type="tel"
                inputMode="numeric"
                maxLength={1}
                aria-label={`Digit ${idx + 1} of ${length}`}
                className="w-12 h-14 text-center text-xl border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-theme focus:outline-none"
                value={val}
                onChange={(e) => handleChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                onPaste={idx === 0 ? handlePaste : undefined} // paste only on first input
              />
            ))}
          </div>

          {/* Verify button */}
          <button
            type="submit"
            disabled={!values.every((val) => val !== "")}
            className="w-full py-3 bg-theme hover:bg-midTheme text-white rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
          >
            Verify
          </button>
        </form>

        {/* Resend OTP */}
        {onResend && (
          <div className="mt-4 text-center text-sm text-gray-600">
            {timer > 0 ? (
              <span>Resend OTP in {timer}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-theme font-medium hover:underline"
              >
                Resend OTP
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
