"use client";
import { useState } from "react";

interface InputFieldProps {
  placeholder: string;
  name: string;
  value: string;
  type: string;
  icon?: React.ReactNode;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField = ({
  placeholder,
  name,
  value,
  type,
  icon,
  onChange,
}: InputFieldProps) => {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={`relative flex items-center w-full rounded-xl border transition-all duration-200 ${
        focused
          ? "border-primary ring-2 ring-primary/20 shadow-sm"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full py-3 px-4 bg-transparent outline-none text-gray-700 placeholder-gray-400 rounded-xl"
      />
      {icon && <div className="pr-3">{icon}</div>}
    </div>
  );
};

export default InputField;