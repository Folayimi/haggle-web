"use client";
import { useState } from "react";
import InputField from "@/reusables/InputFied";
import HaggleButton from "@/reusables/haggleButton";

interface ResetPasswordFormProps {
  onSubmit: (email: string) => void;
  isLoading?: boolean;
}

const ResetPasswordForm = ({ onSubmit, isLoading = false }: ResetPasswordFormProps) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onSubmit(email);
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
          Reset password
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Enter your email address and we'll send you a verification code to reset your password.
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
          text="Send verification code"
          onClick={()=>{}}
          fullWidth
          disabled={!email.trim() || isLoading}
        />

        <div className="text-center text-sm text-gray-500 mt-4">
          Remember your password?{" "}
          <button
            type="button"
            className="text-primary font-medium hover:underline focus:outline-none"
            onClick={() => window.location.href = "/login"}
          >
            Log in
          </button>
        </div>
      </form>
    </>
  );
};

export default ResetPasswordForm;