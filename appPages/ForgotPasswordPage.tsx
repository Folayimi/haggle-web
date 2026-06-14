"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/reusables/InputFied";
import HaggleButton from "@/reusables/haggleButton";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your password reset logic here (e.g., API call)
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 transition-all duration-300">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-1 text-2xl font-bold text-gray-800">
              <span>Haggle</span>
              <span className="text-primary text-3xl">.</span>
            </div>
          </div>

          {!submitted ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
                  Reset password
                </h1>
                <p className="text-gray-500 text-sm mt-2">
                  Enter your email address and we'll send you a link to reset
                  your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <InputField
                  placeholder="Email address"
                  name="email"
                  value={email}
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                />

                <HaggleButton
                  text="Send reset link"
                  onClick={() => {}}
                  fullWidth
                />

                <div className="text-center text-sm text-gray-500 mt-4">
                  Remember your password?{" "}
                  <button
                    type="button"
                    className="text-primary font-medium hover:underline focus:outline-none"
                    onClick={() => router.push("/login")}
                  >
                    Log in
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Check your email
              </h2>
              <p className="text-gray-500">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-primary font-medium hover:underline"
              >
                Back to login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
