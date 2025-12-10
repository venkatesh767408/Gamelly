import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Loader from "../../components/common/Loader";

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, resendOtp, isLoading, error } = useAuth(); // Added error from useAuth

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef([]);

  const email = location.state?.email;
  const form = location.state?.form;

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    if (newOtp.every((digit) => digit !== "") && index === 5) {
      handleSubmit(newOtp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      pastedData.split("").forEach((char, index) => {
        if (index < 6) {
          newOtp[index] = char;
        }
      });
      setOtp(newOtp);
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex].focus();
    }
  };

  const handleSubmit = async (otpValue = otp.join("")) => {
    if (otpValue.length !== 6) {
      // Show local validation error
      alert("Please enter the complete 6-digit OTP");
      return;
    }

    try {
      if (form === "forgot-password") {
        navigate("/reset-password", {
          state: {
            email: email,
            otp: otpValue,
          },
        });
      } else {
        await verifyOtp({ email, otp: otpValue });
        navigate("/");
      }
    } catch (error) {
      // Error is now handled by Redux and will show in Toast
      // You can also clear OTP fields on error if you want
      // setOtp(['', '', '', '', '', '']);
      // inputRefs.current[0]?.focus();
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      await resendOtp(email);
      setCountdown(60);
    } catch (error) {
      // Error is now handled by Redux and will show in Toast
    } finally {
      setResendLoading(false);
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <div
      style={{
        fontFamily: "'Montserrat', sans-serif",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="min-h-screen flex items-center justify-center px-1 sm:px-6 lg:px-8 lg:py-10 relative overflow-hidden"
    >
      {/* Content container */}
      <div className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full relative max-w-md text-center border border-white/20">
        <div className="flex items-center justify-center gap-2 absolute top-0 left-5">
          <span className="text-2xl font-bold text-white">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              PLAY
            </span>
            <span className="text-[#9AEA62]">.</span>
          </span>
        </div>

        <div>
          <h1 className="text-white text-4xl my-4 font-semibold tracking-wide">
            VERIFY OTP
          </h1>
          <p className="text-white/60 text-sm mb-6">
            Enter the 6-digit code sent to {email}
          </p>
        </div>

        {/* Show error message below OTP inputs if needed */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-6">
          {/* OTP Inputs */}
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-2xl text-center text-white font-bold bg-white/10 backdrop-blur-md border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9AEA62] focus:border-[#9AEA62] transition-all duration-300"
                disabled={isLoading}
              />
            ))}
          </div>

          {/* Submit Button */}
          <button
            onClick={() => handleSubmit()}
            disabled={!isOtpComplete || isLoading}
            className="bg-[#9AEA62]/80 backdrop-blur-md text-gray-900 font-semibold p-4 rounded-xl hover:bg-[#9AEA62] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? <Loader size="small" /> : "VERIFY OTP"}
          </button>

          {/* Resend OTP */}
          <div className="text-center">
            <p className="text-white/60 text-sm">
              Didn't receive the code?{" "}
              <button
                onClick={handleResendOtp}
                disabled={resendLoading || countdown > 0}
                className="text-[#9AEA62] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendLoading ? (
                  <Loader size="small" />
                ) : countdown > 0 ? (
                  `Resend in ${countdown}s`
                ) : (
                  "Resend OTP"
                )}
              </button>
            </p>
          </div>
        </div>

        <p className="text-xs mt-6 text-white/80">
          {form === "register" ? (
            <>
              Want to change email?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-[#9AEA62] underline cursor-pointer hover:text-[#8bd95a] transition-colors duration-200"
              >
                Go back
              </button>
            </>
          ) : (
            <>
              Remember your password?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-[#9AEA62] underline cursor-pointer hover:text-[#8bd95a] transition-colors duration-200"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default OTPVerification;
