import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../../utils/validators";
import InputField from "../../components/common/InputField";
import Loader from "../../components/common/Loader";
import SocialAuth from "../../components/common/SocialAuth";

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

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

    if (!validateUsername(formData.username)) {
      newErrors.username =
        "Username must be 3-20 characters and contain only letters, numbers, and underscores";
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters with uppercase, lowercase, number and special character";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await register(formData);
      navigate("/verify-otp", {
        state: { email: formData.email, form: "register" },
      });
    } catch (error) {
      console.log(error);
    }
  };
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
            REGISTER
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            <InputField
               type="text"
               name="username"
               placeholder="username"
               value={formData.username}
               onChange={handleChange}
               error={errors.username}
               required
            />
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
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Create a Password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            showPasswordToggle
            onTogglePassword={() => setShowPassword(!showPassword)}
            isPasswordVisible={showPassword}
            required
          />

         <button
            type="submit"
            disabled={isLoading}
            className="bg-[#9AEA62]/80 backdrop-blur-md text-gray-900 font-semibold p-4 rounded-xl hover:bg-[#9AEA62] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? <Loader size="small" /> : 'SIGN UP'}
          </button>
        </form>

        <SocialAuth/>

        
        <p className="text-xs mt-6 text-white/80">
          Already have an account?{" "}
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

export default Register;
