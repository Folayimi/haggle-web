"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ResetPasswordForm from "./ResetPasswordForm";
import ResetPasswordOtp from "./ResetPasswordOtp";
import NewPasswordForm from "./NewPasswordForm";
import {
  resetPassword,
  sendResetOtp,
  verifyResetOtp,
} from "@/services/request";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

  const handleSendOtp = async (userEmail: string) => {
    try {
      setLoading(true);
      setEmail(userEmail);
      await sendResetOtp({ email: userEmail });
      setStep(2);
    } catch (err: any) {
      console.error("Send OTP error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    try {
      const token = localStorage.getItem("haggleAuthResetToken");
      setLoading(true);
      console.log('reset-token:',token)
      await verifyResetOtp({ email, otp, token: token ?? "" });
      setResetToken(token ?? ""); // Assuming API returns a reset token
      setStep(3);
    } catch (err: any) {
      console.error("OTP verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (
    newPassword: string,
    confirmPassword: string,
  ) => {
    try {
      setLoading(true);
      await resetPassword({ newPassword, confirmPassword, token: resetToken });
      // Redirect to login after successful password reset
      router.push("/login");
    } catch (err: any) {
      console.error("Password reset error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const token = localStorage.getItem("haggleAuthResetToken");
      setResending(true);
      await sendResetOtp({ email });
    } catch (err: any) {
      console.error("Resend OTP error:", err);
    } finally {
      setResending(false);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  };
                                                                                            
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      {/* Loading overlay */}
      {(loading || resending) && (
        <div className="absolute inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 flex items-center gap-3 shadow-xl">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-700">
              {resending ? "Sending new code..." : "Processing..."}
            </span>
          </div>
        </div>
      )}

      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 transition-all duration-300">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-1 text-2xl font-bold text-gray-800">
              <span>Haggle</span>
              <span className="text-primary text-3xl">.</span>
            </div>
          </div>

          {/* Step components */}
          {step === 1 && (
            <ResetPasswordForm onSubmit={handleSendOtp} isLoading={loading} />
          )}

          {step === 2 && (
            <ResetPasswordOtp
              onComplete={handleVerifyOtp}
              onBack={handleBack}
              onResendCode={handleResendOtp}
              email={email}
              isLoading={loading}
              isResending={resending}
            />
          )}

          {step === 3 && (
            <NewPasswordForm
              onSubmit={handleResetPassword}
              onBack={handleBack}
              isLoading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
