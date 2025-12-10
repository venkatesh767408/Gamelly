import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import { validatePassword } from "../../utils/validators";
import InputField from "../../components/common/InputField";
import Loader from "../../components/common/Loader";
import { useEffect } from "react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { confirmPasswordReset, isLoading, error } = useAuth();

  const [formData, setFormData] = useState({
    email: location.state?.email,
    otp: location.state?.otp || "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tokenFromUrl = searchParams.get("token");
    const emailFromUrl = searchParams.get("email");

    if (tokenFromUrl && !formData.otp) {
      setFormData((prev) => ({ ...prev, otp: tokenFromUrl }));
    }
    if (emailFromUrl && !formData.email) {
      setFormData((prev) => ({ ...prev, email: emailFromUrl }));
    }
  }, [location.search, formData.otp, formData.email]);

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
    if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters with uppercase, lowercase, number and special character";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.otp) {
      newErrors.otp = "OTP is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await confirmPasswordReset({
        email: formData.email,
        token: formData.otp,
        password: formData.password,
      });

      
   

      setIsSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      // Error handling is done in the auth slice
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  if (isSuccess) {
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
              SUCCESS!
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-white/80 text-sm">
              Your password has been reset successfully!
            </p>
            <p className="text-white/60 text-xs">
              Redirecting to login page...
            </p>

            <button
              onClick={handleBackToLogin}
              className="w-full bg-[#9AEA62]/80 backdrop-blur-md text-gray-900 font-semibold p-3 rounded-xl hover:bg-[#9AEA62] transition-all duration-300 mt-4"
            >
              Go to Login Now
            </button>
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
            RESET PASSWORD
          </h1>
          <p className="text-white/60 text-sm mb-6">Create your new password</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <InputField
            type="email"
            name="email"
            placeholder="Enter Your Email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
          <InputField
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={formData.otp}
            onChange={handleChange}
            error={errors.otp}
            required
          />
          <InputField
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="New Password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            showPasswordToggle
            onTogglePassword={() => setShowPassword(!showPassword)}
            isPasswordVisible={showPassword}
            required
          />

          <InputField
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            showPasswordToggle
            onTogglePassword={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            isPasswordVisible={showConfirmPassword}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#9AEA62]/80 backdrop-blur-md text-gray-900 font-semibold p-4 rounded-xl hover:bg-[#9AEA62] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? <Loader size="small" /> : "RESET PASSWORD"}
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
      </div>
    </div>
  );
};

export default ResetPassword;
