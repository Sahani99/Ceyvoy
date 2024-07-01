import React, { useState } from "react";
import "./../styles/Login.css";

import user_icon from "../assets/name.png";
import email_icon from "../assets/emil.png";
import password_icon from "../assets/pwrd.png";

const Login = () => {
  const [action, setAction] = useState("Login");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    licenseNumber: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (
      action === "Sign Up" &&
      (formData.name === "" ||
        formData.email === "" ||
        formData.password === "" ||
        formData.confirmPassword === "" ||
        role === "")
    ) {
      setMessage("All fields are required.");
      return;
    }

    if (
      action === "Sign Up" &&
      formData.password !== formData.confirmPassword
    ) {
      setMessage("Passwords do not match.");
      return;
    }

    const url =
      action === "Login"
        ? "http://localhost/Ceyvoy/login.php"
        : "http://localhost/Ceyvoy/signup.php";
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role,
      licenseNumber: formData.licenseNumber,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    setMessage(result.message);
  };

  return (
    <body className="login-page">
      <div className="login-container">
        <div className="header">
          <div className="text">{action}</div>
          <div className="underline"></div>
        </div>

        {action === "Sign Up" && (
          <>
            <div className="role-selection">
              <div className="card-group">
                <div
                  className={`Logincard ${
                    role === "Traveller" ? "selected" : ""
                  }`}
                  onClick={() => setRole("Traveller")}
                >
                  Traveller
                </div>
                <div
                  className={`Logincard ${
                    role === "Tourguide" ? "selected" : ""
                  }`}
                  onClick={() => setRole("Tourguide")}
                >
                  Tourguide
                </div>
                <div
                  className={`Logincard ${
                    role === "Accommodation" ? "selected" : ""
                  }`}
                  onClick={() => setRole("Accommodation")}
                >
                  Accommodation
                </div>
              </div>
            </div>
            {role === "Tourguide" && (
              <div className="input license-input">
                <img src={user_icon} alt="license number" />
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  placeholder="License Number"
                />
              </div>
            )}
          </>
        )}

        <div className="inputs">
          {action === "Login" ? null : (
            <div className="input">
              <img src={user_icon} alt="name" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
              />
            </div>
          )}

          <div className="input">
            <img src={email_icon} alt="email" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Id"
            />
          </div>

          <div className="input">
            <img src={password_icon} alt="password" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
            />
            <i
              className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>

          {action === "Sign Up" && (
            <div className="input">
              <img src={password_icon} alt="confirm password" />
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
              />
              <i
                className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          )}
        </div>

        {action === "Sign Up" ? null : (
          <div className="forgot-password">
            Forgot Password? <span>Click Here!</span>
          </div>
        )}

        <div className="submit-container">
          <div
            className={`submit ${action === "Login" ? "gray" : ""}`}
            onClick={() => setAction("Sign Up")}
          >
            Sign Up
          </div>
          <div
            className={`submit ${action === "Sign Up" ? "gray" : ""}`}
            onClick={() => setAction("Login")}
          >
            Login
          </div>
        </div>
        <div className="submit-container">
          <div className="submit" onClick={handleSubmit}>
            Submit
          </div>
        </div>
        {message && <div className="message">{message}</div>}
      </div>
    </body>
  );
};

export default Login;
