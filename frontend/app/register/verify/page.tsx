"use client";

import OtpForm from "@/components/OtpForm";
import apiClient from "@/utils/axiosClient";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function OtpPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");

  const handleOtpSubmit = async (otp: string) => {
    try {
      const res = await apiClient.post("api/v1/auth/users/verify-otp/", {
        email,
        otp,
      });

      console.log("OTP Verified:", res.data);
      toast.success("OTP verified successfully!");

      // redirect or show success
      router.push("/login"); // or wherever you want
    } catch {
      console.error(" OTP Verification failed:");
      toast.error("Invalid OTP. Please try again.");
    }
  };

  return (
    <div>
      {email && <p className="text-center mb-4">Verifying email: {email}</p>}

      <OtpForm
        title="Enter OTP"
        description="We’ve sent a one-time password to your email."
        logo="/gtnlogo.png"
        onSubmit={handleOtpSubmit}
        onResend={() => console.log("Resend OTP clicked")} // optional
      />
    </div>
  );
}
