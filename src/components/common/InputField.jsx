import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const InputField = ({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  error,
  showPasswordToggle = false,
  onTogglePassword,
  isPasswordVisible = false,
  required = false,
  disabled = false,
}) => {
  return (
    <div className="relative">
      <input
        type={
          showPasswordToggle ? (isPasswordVisible ? "text" : "password") : type
        }
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`text-white text-sm bg-white/10 backdrop-blur-md border ${
          error ? "border-red-400" : "border-white/20"
        }  rounded-lg p-4 w-full pr-12 focus:outline-none focus:ring-2 focus:ring-[#9AEA62] focus:border-[#9AEA62] transition-all duration-300 placeholder-white/50 disabled:opacity-50`}
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white transition-colors duration-200"
        >
          {isPasswordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
        </button>
      )}
      {error && <p className="text-red-400 text-xs mt-1 text-left">{error}</p>}
    </div>
  );
};

export default InputField;
