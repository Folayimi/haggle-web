"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import InputField from "@/reusables/InputFied";
import HaggleButton from "@/reusables/haggleButton";

interface SignupStep1Props {
  onNext: (data: { fullName: string; email: string }) => void;
  initialData?: { fullName: string; email: string };
}

const SignupStep1 = ({ onNext, initialData }: SignupStep1Props) => {
  const [userDetails, setUserDetails] = useState({
    fullName: initialData?.fullName || "",
    email: initialData?.email || "",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
  });
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
  });
  const [isFormValid, setIsFormValid] = useState(false);

  // Validation functions
  const validateFullName = (name: string) => {
    if (!name.trim()) return "Full name is required";
    if (name.length < 2) return "Name must be at least 2 characters";
    if (name.length > 50) return "Name must be less than 50 characters";
    if (!/^[a-zA-Z\s\-']+$/.test(name))
      return "Name can only contain letters, spaces, hyphens, and apostrophes";
    return "";
  };

  const validateEmail = (email: string) => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  // Handle field blur
  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));

    switch (name) {
      case "fullName":
        setErrors((prev) => ({ ...prev, fullName: validateFullName(value) }));
        break;
      case "email":
        setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
        break;
    }
  };

  // Check form validity
  useEffect(() => {
    const isValid =
      userDetails.fullName.trim() !== "" &&
      userDetails.email.trim() !== "" &&
      errors.fullName === "" &&
      errors.email === "";

    setIsFormValid(isValid);
  }, [userDetails, errors]);

  const handleContinue = () => {
    if (isFormValid) {
      onNext({ fullName: userDetails.fullName, email: userDetails.email });
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <InputField
          placeholder="Full name"
          name="fullName"
          value={userDetails.fullName}
          type="text"
          onChange={handleChange}
          onBlur={() => handleBlur("fullName")}
        />
        {touched.fullName && errors.fullName && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <XCircle size={12} />
            {errors.fullName}
          </p>
        )}
        {touched.fullName && !errors.fullName && userDetails.fullName && (
          <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
            <CheckCircle size={12} />
            Valid name
          </p>
        )}
      </div>

      <div>
        <InputField
          placeholder="Email address"
          name="email"
          value={userDetails.email}
          type="email"
          onChange={handleChange}
          onBlur={() => handleBlur("email")}
        />
        {touched.email && errors.email && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <XCircle size={12} />
            {errors.email}
          </p>
        )}
        {touched.email && !errors.email && userDetails.email && (
          <p className="text-green-500 text-xs mt-1 flex items-center gap-1">
            <CheckCircle size={12} />
            Valid email
          </p>
        )}
      </div>

      <HaggleButton
        text="Continue"
        onClick={handleContinue}
        fullWidth
        disabled={!isFormValid}
      />
    </div>
  );
};

export default SignupStep1;