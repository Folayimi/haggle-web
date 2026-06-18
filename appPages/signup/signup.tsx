"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SignupStep1 from "./SignupStep1";
import SignupStep2 from "./SignupStep2";
import OtpInput from "./OtpInput";
import { userSignup, verifyOtp, resendOtp } from "@/services/request";
import Loader from "@/reusables/loader";

const SignupPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleStep1Next = (data: { fullName: string; email: string }) => {
    setUserData((prev) => ({
      ...prev,
      fullName: data.fullName,
      email: data.email,
    }));
    setStep(2);
  };

  const handleStep2Back = () => {
    setStep(1);
  };

  const handleSignupSubmit = async (password: string) => {
    try {
      setLoading(true);
      setUserData((prev) => ({ ...prev, password }));

      const signupData = {
        fullName: userData.fullName,
        email: userData.email,
        password: password,
      };

      const result = await userSignup(signupData);
      console.log("Signup successful, sending OTP:", result);

      // Move to OTP verification step
      setStep(3);
    } catch (err: any) {
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpComplete = async (otp: string) => {
    const token = localStorage.getItem("haggleAuthAccessToken");
    try {
      setLoading(true);

      const verificationData = {
        email: userData.email,
        otp: otp,
        token: token ?? "",
      };
      const result = await verifyOtp(verificationData);
      console.log("OTP verified:", result);

      // Redirect to login after successful verification
      router.push("/login");
    } catch (err: any) {
      console.error("OTP verification error:", err);
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setResending(true);
      const resendData = {
        email: userData.email,
      };

      await resendOtp(resendData);
      console.log("OTP resent successfully");
    } catch (err: any) {
      console.error("Resend OTP error:", err);
    } finally {
      setResending(false);
    }
  };

  const handleOtpBack = () => {
    setStep(2);
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      {/* Loading overlay */}
      {(loading || resending) && (
        <Loader
          type={resending ? "resending" : step === 2 ? "signup" : "verify"}
        />
      )}

      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 transition-all duration-300">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-1 text-2xl font-bold text-gray-800">
              <span>Haggle</span>
              <span className="text-primary text-3xl">.</span>
            </div>
          </div>

          {/* Progress indicator - only show for steps 1-2 */}
          {step !== 3 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-primary font-medium">
                  Step {step} of 2
                </span>
                <span className="text-xs text-gray-400">
                  {step === 1 ? "Basic Information" : "Set Password"}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all duration-300"
                  style={{ width: step === 1 ? "50%" : "100%" }}
                />
              </div>
            </div>
          )}

          {/* Welcome text */}
          <div className="text-center mb-6">
            {step === 1 && (
              <>
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
                  Create an account
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  Join the haggle marketplace today
                </p>
              </>
            )}
            {step === 2 && (
              <>
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
                  Set your password
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  Create a strong password for your account
                </p>
              </>
            )}
            {step === 3 && (
              <>
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
                  Verify your email
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  Enter the 6-digit code sent to your email
                </p>
              </>
            )}
          </div>

          {/* Step components */}
          {step === 1 && (
            <SignupStep1
              onNext={handleStep1Next}
              initialData={{
                fullName: userData.fullName,
                email: userData.email,
              }}
            />
          )}

          {step === 2 && (
            <SignupStep2
              onBack={handleStep2Back}
              onSubmit={handleSignupSubmit}
              email={userData.email}
              isLoading={loading}
            />
          )}

          {step === 3 && (
            <OtpInput
              onComplete={handleOtpComplete}
              onBack={handleOtpBack}
              onResendCode={handleResendCode}
              email={userData.email}
              isLoading={loading}
              isResending={resending}
            />
          )}

          {/* Login link - hide during OTP */}
          {step !== 3 && (
            <div className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <button
                type="button"
                className="text-primary font-medium hover:underline focus:outline-none"
                onClick={() => router.push("/login")}
              >
                Log in
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
