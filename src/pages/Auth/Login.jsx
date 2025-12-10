import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validatePassword } from '../../utils/validators';
import InputField from '../../components/common/InputField';
import SocialAuth from '../../components/common/SocialAuth';
import Loader from '../../components/common/Loader';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await login(formData);
      navigate('/'); // Redirect to dashboard after successful login
    } catch (error) {
      // Error handling is done in the auth slice
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

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
      {/* Content container */}
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
          <h1 className="text-white text-4xl my-4 font-semibold tracking-wide">
            WELCOME BACK!
          </h1>
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
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter Your Password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            showPasswordToggle
            onTogglePassword={() => setShowPassword(!showPassword)}
            isPasswordVisible={showPassword}
            required
          />

          <div className="text-right">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-[#9AEA62] text-sm hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#9AEA62]/80 backdrop-blur-md text-gray-900 font-semibold p-4 rounded-xl hover:bg-[#9AEA62] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? <Loader size="small" /> : 'LOGIN'}
          </button>
        </form>

        <SocialAuth />

        <p className="text-xs mt-6 text-white/80">
          Don't have an account?{" "}
          <Link to="/register">
            <span className="text-[#9AEA62] underline cursor-pointer hover:text-[#8bd95a] transition-colors duration-200">
              SignUp
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;