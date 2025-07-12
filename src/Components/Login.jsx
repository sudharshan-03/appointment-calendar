import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" }); // state to save credentials
  const [helperText, setHelperText] = useState(""); // this is the helper message, when error comes it shows
  const [showPassword, setShowPassword] = useState(false); //this is the state that is used to toggle the password show or not
  const navigate = useNavigate(); // use to navigate

  const toggleButton = () => setShowPassword(!showPassword);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) { // checking empty fields
      setHelperText(" please Enter all the fields");
    } else {
      if (
        credentials.email === "staff@clinic.com" &&
        credentials.password === "123456"
      ) { // checking the password and email by hardcoding
        setHelperText("");
        navigate("/calendar");
      } else {
        setHelperText("Invalid email or password");
      }
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen  bg-gradient-to-br from-amber-300 to-yellow-400 px-4">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Clinic Staff Login
        </h2>
        <form
          className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 sm:p-8 flex flex-col gap-4"
          onSubmit={handleLogin}
        >
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              autoComplete="email"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="flex flex-col gap-1 relative">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password:
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} className="absolute bottom-1/5 right-4" onClick={toggleButton} />
          </div>
          {helperText && <p className="text-red-600 text-sm">{helperText}</p>}
          <button
            type="submit"
            className="w-full bg-amber-500 text-white py-2 rounded-md hover:bg-amber-600 transition cursor-pointer"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
