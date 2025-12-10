

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import { validateEmail } from "../../utils/validators";
import InputField from "../../components/common/InputField";
import Loader from "../../components/common/Loader";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { requestPasswordReset, isLoading} = useAuth();

  const [formData, setFormData] = useState({
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm) return;

    try {
      await requestPasswordReset(formData.email);
      setIsSubmitted(true);
       navigate('/verify-otp', {
      state: {
        email: formData.email,
        form: 'forgot-password'
      }
    });
    } catch (error) {
      // Error handling is done in the auth slice
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  if (isSubmitted) {
    return (
      <div
        style={{
          fontFamily: "'Montserrat', sans-serif",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="min-h-screen flex items-center justify-center px-1 lg:py-10 sm:px-6 lg:px-8 relative overflow-hidden"
      >
        <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl relative shadow-xl w-full max-w-md text-center border border-white/20">
          <div className="flex absolute top-0 left-4 items-center justify-center gap-2">
            <span className="text-2xl font-bold text-white">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                PLAY
              </span>
              <span className="text-[#9AEA62]">.</span>
            </span>
          </div>

          <div className="mb-6">
            <h1 className="text-white text-3xl my-4 font-semibold tracking-wide">
              CHECK YOUR EMAIL
            </h1>
            <div className="w-16 h-16 bg-[#9AEA62]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-[#9AEA62]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-white/80 text-sm">
              We've sent a password reset OTP to{" "}
              <strong>{formData.email}</strong>
            </p>
            <p className="text-white/60 text-xs">
              Please check your email and follow the instructions to reset your
              password. The OTP will expire in 10 minutes.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleBackToLogin}
                className="flex-1 bg-white/10 backdrop-blur-md text-white font-semibold p-3 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                Back to Login
              </button>
              <button
                onClick={() =>
                  navigate("/verify-otp", {
                    state: {
                      email: formData.email,
                      form: "forgot-password",
                    },
                  })
                }
                className="flex-1 bg-[#9AEA62]/80 backdrop-blur-md text-gray-900 font-semibold p-3 rounded-xl hover:bg-[#9AEA62] transition-all duration-300"
              >
                Enter OTP
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "'Montserrat', sans-serif",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="min-h-screen flex items-center justify-center px-1 lg:py-10 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl relative shadow-xl w-full max-w-md text-center border border-white/20">
        <div className="flex absolute top-0 left-4 items-center justify-center gap-2">
          <span className="text-2xl font-bold text-white">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              PLAY
            </span>
            <span className="text-[#9AEA62]">.</span>
          </span>
        </div>

        <div>
          <h1 className="text-white text-3xl my-4 font-semibold tracking-wide">
            FORGOT PASSWORD
          </h1>
          <p className="text-white/60 text-sm mb-6">
            Enter your email to receive a reset OTP
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <InputField
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#9AEA62]/80 backdrop-blur-md text-gray-900 font-semibold p-4 rounded-xl hover:bg-[#9AEA62] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? <Loader size="small" /> : "SEND RESET OTP"}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={handleBackToLogin}
            className="text-[#9AEA62] text-sm hover:underline"
          >
            Back to Login
          </button>
        </div>

        <p className="text-xs mt-6 text-white/80">
          Remember your password?{" "}
          <Link to="/login">
            <span className="text-[#9AEA62] underline cursor-pointer hover:text-[#8bd95a] transition-colors duration-200">
              Login
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};


export default ForgotPassword
