import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const GoogleLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token from URL after redirect
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (token) {
      // Save token in localStorage
      localStorage.setItem("accessToken", token);

      // Redirect to dashboard (or wherever you want)
      navigate("/dashboard");
    }
  }, [location, navigate]);

  const handleGoogleLogin = () => {
    // Redirect to backend route (starts OAuth flow)
    window.location.href = 'http://localhost:8001/api/v1/auth/google/login';
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Welcome Back</h2>
        <p className="text-gray-500 mb-6">Sign in to your account</p>

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-gray-700 font-medium hover:bg-gray-50 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-6 h-6"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default GoogleLoginPage;
