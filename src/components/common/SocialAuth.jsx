import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useRef } from "react";
import { GoogleLogin } from '@react-oauth/google';

const SocialAuth = () => {
  const navigate = useNavigate();
  const { GoogleLogin: googleLogin, isLoading, isAuthenticated } = useAuth();
  const loginInProgress = useRef(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      loginInProgress.current = true;
      await googleLogin(credentialResponse.credential);
      navigate("/");
    } catch (error) {
      console.error("Google Login Error:", error);
      loginInProgress.current = false;
    }
  };

  const handleGoogleError = () => {
    console.log("Google Login Failed");
    loginInProgress.current = false;
  };

  useEffect(() => {
    if (isAuthenticated && loginInProgress.current) {
      navigate("/");
      loginInProgress.current = false;
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-transparent text-white/60">Or continue with</span>
        </div>
      </div>



      <div className="mt-4">
            <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="filled_black"
            size="large"
            text="continue_with"
            shape="rectangular"
            width=""
            useOneTap={false}
            />
      </div>
    </div>
  );
};


export default SocialAuth
