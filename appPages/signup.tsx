"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import InputField from "@/reusables/InputFied";
import HaggleButton from "@/reusables/haggleButton";

const SignupPage = () => {
  const router = useRouter();
  const [userDetails, setUserDetails] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = () => {
    // Add signup logic here
    router.push("/");
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

          {/* Welcome text */}
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
              Create an account
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Join the haggle marketplace today
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            <InputField
              placeholder="Full name"
              name="fullName"
              value={userDetails.fullName}
              type="text"
              onChange={handleChange}
            />

            <InputField
              placeholder="Email address"
              name="email"
              value={userDetails.email}
              type="email"
              onChange={handleChange}
            />

            <InputField
              placeholder="Password"
              name="password"
              value={userDetails.password}
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
              onChange={handleChange}
            />

            <InputField
              placeholder="Confirm password"
              name="confirmPassword"
              value={userDetails.confirmPassword}
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
              onChange={handleChange}
            />

            <HaggleButton text="Sign up" onClick={handleSignup} fullWidth />

            <div className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{" "}
              <button
                type="button"
                className="text-primary font-medium hover:underline focus:outline-none"
                onClick={() => router.push("/login")}
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;