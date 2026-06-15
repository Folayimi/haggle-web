"use client";
import { useState, useEffect } from "react";
import { EyeIcon, EyeOffIcon, CheckCircle, XCircle } from "lucide-react";
import InputField from "@/reusables/InputFied";
import HaggleButton from "@/reusables/haggleButton";

interface NewPasswordFormProps {
  onSubmit: (password: string) => void;
  isLoading?: boolean;
  onBack: () => void;
}

const NewPasswordForm = ({ onSubmit, isLoading = false, onBack }: NewPasswordFormProps) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
    color: "",
  });
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });
  const [isFormValid, setIsFormValid] = useState(false);

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    let score = 0;
    let label = "";
    let color = "";

    if (password.length === 0) {
      label = "";
      color = "bg-gray-200";
      return { score, label, color };
    }

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    score = Math.min(4, Math.floor(score / 2));

    switch (score) {
      case 0:
        label = "Very Weak";
        color = "bg-red-500";
        break;
      case 1:
        label = "Weak";
        color = "bg-orange-500";
        break;
      case 2:
        label = "Fair";
        color = "bg-yellow-500";
        break;
      case 3:
        label = "Good";
        color = "bg-blue-500";
        break;
      case 4:
        label = "Strong";
        color = "bg-green-500";
        break;
    }

    return { score, label, color };
  };

  const validatePassword = (password: string) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (password.length > 100) return "Password must be less than 100 characters";

    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (!hasLetter) return "Password must contain at least one letter";
    if (!hasNumber) return "Password must contain at least one number";
    if (!hasSpecial) return "Password must contain at least one special character";

    return "";
  };

  const validateConfirmPassword = (confirmPassword: string, password: string) => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== password) return "Passwords do not match";
    return "";
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    setPasswordStrength(checkPasswordStrength(value));
    
    if (confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateConfirmPassword(confirmPassword, value),
      }));
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setErrors((prev) => ({
      ...prev,
      confirmPassword: validateConfirmPassword(value, password),
    }));
  };

  useEffect(() => {
    const isValid =
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      errors.password === "" &&
      errors.confirmPassword === "";

    setIsFormValid(isValid);
  }, [password, confirmPassword, errors]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid && !isLoading) {
      onSubmit(password);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center mb-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
          Create new password
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Your new password must be different from your previous password
        </p>
      </div>

      <div>
        <InputField
          placeholder="New password"
          name="password"
          value={password}
          type={showPassword ? "text" : "password"}
          icon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOffIcon size={18} className="text-gray-400 hover:text-gray-600 transition" />
              ) : (
                <EyeIcon size={18} className="text-gray-400 hover:text-gray-600 transition" />
              )}
            </button>
          }
          onChange={handlePasswordChange}
          onBlur={() => handleBlur("password")}
        />

        {password && (
          <div className="mt-2 space-y-1">
            <div className="flex gap-1 h-1.5">
              <div className={`flex-1 rounded-l ${passwordStrength.score >= 1 ? passwordStrength.color : "bg-gray-200"}`} />
              <div className={`flex-1 ${passwordStrength.score >= 2 ? passwordStrength.color : "bg-gray-200"}`} />
              <div className={`flex-1 ${passwordStrength.score >= 3 ? passwordStrength.color : "bg-gray-200"}`} />
              <div className={`flex-1 rounded-r ${passwordStrength.score >= 4 ? passwordStrength.color : "bg-gray-200"}`} />
            </div>
            <div className="flex justify-between items-center">
              <p className={`text-xs font-medium ${passwordStrength.color.replace("bg-", "text-")}`}>
                {passwordStrength.label}
              </p>
              <p className="text-xs text-gray-400">{password.length}/100 chars</p>
            </div>
            <ul className="text-xs text-gray-500 space-y-0.5 mt-2">
              <li className={`flex items-center gap-1 ${password.length >= 8 ? "text-green-600" : ""}`}>
                {password.length >= 8 ? <CheckCircle size={10} /> : <XCircle size={10} />}
                At least 8 characters
              </li>
              <li className={`flex items-center gap-1 ${/[A-Za-z]/.test(password) ? "text-green-600" : ""}`}>
                {/[A-Za-z]/.test(password) ? <CheckCircle size={10} /> : <XCircle size={10} />}
                Contains letters
              </li>
              <li className={`flex items-center gap-1 ${/[0-9]/.test(password) ? "text-green-600" : ""}`}>
                {/[0-9]/.test(password) ? <CheckCircle size={10} /> : <XCircle size={10} />}
                Contains numbers
              </li>
              <li className={`flex items-center gap-1 ${/[^A-Za-z0-9]/.test(password) ? "text-green-600" : ""}`}>
                {/[^A-Za-z0-9]/.test(password) ? <CheckCircle size={10} /> : <XCircle size={10} />}
                Contains special characters
              </li>
            </ul>
          </div>
        )}
        {touched.password && errors.password && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <XCircle size={12} />
            {errors.password}
          </p>
        )}
      </div>

      <div>
        <InputField
          placeholder="Confirm new password"
          name="confirmPassword"
          value={confirmPassword}
          type={showConfirmPassword ? "text" : "password"}
          icon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="focus:outline-none"
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <EyeOffIcon size={18} className="text-gray-400 hover:text-gray-600 transition" />
              ) : (
                <EyeIcon size={18} className="text-gray-400 hover:text-gray-600 transition" />
              )}
            </button>
          }
          onChange={handleConfirmPasswordChange}
          onBlur={() => handleBlur("confirmPassword")}
        />
        {touched.confirmPassword && errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <XCircle size={12} />
            {errors.confirmPassword}
          </p>
        )}
        {touched.confirmPassword && !errors.confirmPassword && confirmPassword && (
          <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
            <CheckCircle size={12} />
            Passwords match
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition"
        >
          Back
        </button>
        <div className="flex-1">
          <HaggleButton
            text={isLoading ? "Resetting password..." : "Reset password"}
            onClick={()=>{}}
            fullWidth
            disabled={!isFormValid || isLoading}
          />
        </div>
      </div>
    </form>
  );
};

export default NewPasswordForm;