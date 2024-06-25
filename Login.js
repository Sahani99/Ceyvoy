import React, { useState } from 'react';
import './../styles/Login.css';

import user_icon from '../assets/name.png';
import email_icon from '../assets/emil.png';
import password_icon from '../assets/pwrd.png';

const Login = () => {
  const [action, setAction] = useState("Login");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("");

  return (
    <body className="login-page">
      <div className='login-container'>
        <div className="header">
          <div className="text">{action}</div>
          <div className="underline"></div>
        </div>

        {action === "Sign Up" && (
          <>
            <div className="input role-selection">
              <img src={user_icon} alt="sign in as" />
              <div className="card-group">
                <div
                  className={`card ${role === "Traveller" ? "selected" : ""}`}
                  onClick={() => setRole("Traveller")}
                >
                  Traveller
                </div>
                <div
                  className={`card ${role === "Tourguide" ? "selected" : ""}`}
                  onClick={() => setRole("Tourguide")}
                >
                  Tourguide
                </div>
                <div
                  className={`card ${role === "Accommodation" ? "selected" : ""}`}
                  onClick={() => setRole("Accommodation")}
                >
                  Accommodation
                </div>
              </div>
            </div>
            {role === "Tourguide" && (
              <div className="input license-input">
                <img src={user_icon} alt="license number" />
                <input type="text" placeholder="License Number" />
              </div>
            )}
          </>
        )}

        <div className="inputs">
          {action === "Login" ? null : (
            <div className="input">
              <img src={user_icon} alt="name" />
              <input type="text" placeholder="Name" />
            </div>
          )}

          <div className="input">
            <img src={email_icon} alt="email" />
            <input type="email" placeholder="Email Id" />
          </div>

          <div className="input">
            <img src={password_icon} alt="password" />
            <input
              type={showPassword ? "text" : "password"}
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
      </div>
    </body>
  );
};

export default Login;
