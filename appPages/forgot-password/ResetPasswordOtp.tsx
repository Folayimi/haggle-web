"use client";
import { useState, useRef, useEffect } from "react";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";

interface ResetPasswordOtpProps {
  onComplete: (otp: string) => void;
  email: string;
  onBack: () => void;
  onResendCode: () => void;
  isLoading?: boolean;
  isResending?: boolean;
}

const ResetPasswordOtp = ({
  onComplete,
  email,
  onBack,
  onResendCode,
  isLoading = false,
  isResending = false,
}: ResetPasswordOtpProps) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    // Start countdown timer
    if (timer > 0 && !canResend) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, canResend]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Allow only digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only the last character
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }

    // Check if OTP is complete
    if (newOtp.every((digit) => digit !== "") && index === 5 && value) {
      console.log("new_reset_otp: ", newOtp);
      const otpString = newOtp.join("");
      if (otpString.length === 6) {
        onComplete(otpString);
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move to previous input on backspace if current is empty
        inputRefs[index - 1].current?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      } else if (otp[index]) {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }

    // Handle left arrow
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs[index - 1].current?.focus();
    }

    // Handle right arrow
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    // Check if pasted content is 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      setError("");

      // Auto-focus last input after paste
      inputRefs[5].current?.focus();

      // Auto-submit on paste
      onComplete(pastedData);
    } else {
      setError("Please paste a valid 6-digit code");
    }
  };

  const handleResendCode = () => {
    if (canResend && !isResending) {
      onResendCode();
      setTimer(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      setError("");
      inputRefs[0].current?.focus();
    }
  };

  return (
    <div className="space-y-6">
      {/* Email info */}
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs text-gray-500 text-center">
          We've sent a verification code to
        </p>
        <p className="text-sm font-medium text-gray-800 text-center mt-1">
          {email}
        </p>
      </div>

      {/* OTP Input Boxes */}
      <div className="space-y-4">
        <div className="flex justify-center gap-3 md:gap-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className={`
                w-12 h-12 md:w-14 md:h-14 text-black
                text-center text-xl md:text-2xl font-semibold
                bg-white border-2 rounded-xl
                focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
                transition-all duration-200
                ${error ? "border-red-500" : "border-gray-200"}
                ${digit ? "border-primary bg-primary/5" : "border-gray-200"}
              `}
              disabled={isLoading}
            />
          ))}
        </div>

        {/* Error message */}
        {error && (
          <p className="text-red-500 text-xs text-center flex items-center justify-center gap-1">
            <XCircle size={12} />
            {error}
          </p>
        )}

        {/* Success message placeholder */}
        {!error && otp.every((digit) => digit !== "") && (
          <p className="text-green-500 text-xs text-center flex items-center justify-center gap-1">
            <CheckCircle size={12} />
            Code verified!
          </p>
        )}
      </div>

      {/* Resend code section */}
      <div className="text-center">
        {!canResend ? (
          <p className="text-sm text-gray-500">
            Resend code in{" "}
            <span className="font-semibold text-primary">{timer}s</span>
          </p>
        ) : (
          <button
            onClick={handleResendCode}
            disabled={isResending}
            className="text-sm text-primary font-medium hover:underline focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? "Sending..." : "Resend verification code"}
          </button>
        )}
      </div>

      {/* Back button */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordOtp;
