import React, { useState } from 'react';
import '../styles/Login.css'; // Import the custom CSS
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUpload, FaPhone } from 'react-icons/fa';

const Login = () => {
    const [action, setAction] = useState("Login");
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [licenseNumber, setLicenseNumber] = useState("");
    const [description, setDescription] = useState("");
    const [spokenLanguages, setSpokenLanguages] = useState([]);
    const [category, setCategory] = useState("");
    const [priceRange, setPriceRange] = useState("");
    const [accommodationDescription, setAccommodationDescription] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [address, setAddress] = useState("");
    const [uploadedImages, setUploadedImages] = useState([]);

    const handleRoleSelect = (selectedRole) => {
        setRole(selectedRole);
    };

    const handleLanguageSelect = (language) => {
        const updatedLanguages = [...spokenLanguages];
        if (updatedLanguages.includes(language)) {
            updatedLanguages.splice(updatedLanguages.indexOf(language), 1);
        } else {
            updatedLanguages.push(language);
        }
        setSpokenLanguages(updatedLanguages);
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const urls = files.map((file) => URL.createObjectURL(file));
        setUploadedImages((prevImages) => [...prevImages, ...urls]);
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <div className="login-text">{action}</div>
                    <div className="login-underline"></div>
                </div>

                {action === "Sign Up" && (
                    <>
                        <div className="login-role-selection">
                            <div className="login-card-group">
                                <div
                                    className={`login-card ${role === "Traveller" ? "selected" : ""}`}
                                    onClick={() => handleRoleSelect("Traveller")}
                                >
                                    Traveller
                                </div>
                                <div
                                    className={`login-card ${role === "Tourguide" ? "selected" : ""}`}
                                    onClick={() => handleRoleSelect("Tourguide")}
                                >
                                    Tourguide
                                </div>
                                <div
                                    className={`login-card ${role === "Accommodation" ? "selected" : ""}`}
                                    onClick={() => handleRoleSelect("Accommodation")}
                                >
                                    Accommodation
                                </div>
                            </div>
                        </div>

                        {role === "Tourguide" && (
                            <>
                                <div className="login-input-group">
                                    <FaUser />
                                    <input
                                        type="text"
                                        placeholder="License Number"
                                        value={licenseNumber}
                                        onChange={(e) => setLicenseNumber(e.target.value)}
                                    />
                                </div>
                                <div className="login-input-group">
                                    <FaUser />
                                    <input
                                        type="text"
                                        placeholder="Description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                                <div className="login-input-group">
                                    <FaUpload />
                                    <div>
                                        <label htmlFor="upload">Upload Image</label>
                                        <input
                                            id="upload"
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={handleImageUpload}
                                        />
                                    </div>
                                </div>
                                <div className="login-input-group">
                                    <FaUser />
                                    <input
                                        type="text"
                                        placeholder="Spoken Languages"
                                        value={spokenLanguages.join(', ')}
                                        readOnly
                                    />
                                    <div className="checkbox-container">
                                        <input
                                            type="checkbox"
                                            id="english"
                                            value="English"
                                            onChange={() => handleLanguageSelect("English")}
                                        />
                                        <label htmlFor="english">English</label>

                                        <input
                                            type="checkbox"
                                            id="sinhala"
                                            value="Sinhala"
                                            onChange={() => handleLanguageSelect("Sinhala")}
                                        />
                                        <label htmlFor="sinhala">Sinhala</label>

                                        <input
                                            type="checkbox"
                                            id="hindi"
                                            value="Hindi"
                                            onChange={() => handleLanguageSelect("Hindi")}
                                        />
                                        <label htmlFor="hindi">Hindi</label>

                                        <input
                                            type="checkbox"
                                            id="other-languages"
                                            value="Other"
                                            onChange={() => handleLanguageSelect("Other")}
                                        />
                                        <label htmlFor="other-languages">Other</label>
                                    </div>
                                </div>
                            </>
                        )}

                        {role === "Accommodation" && (
                            <>
                                <div className="login-input-group">
                                    <FaUser />
                                    <input
                                        type="text"
                                        placeholder="Category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    />
                                    <div className="checkbox-container">
                                        <input
                                            type="checkbox"
                                            id="luxury"
                                            value="Luxury"
                                            onChange={() => {}}
                                        />
                                        <label htmlFor="luxury">Luxury</label>

                                        <input
                                            type="checkbox"
                                            id="beach"
                                            value="Beach"
                                            onChange={() => {}}
                                        />
                                        <label htmlFor="beach">Beach</label>

                                        <input
                                            type="checkbox"
                                            id="hill"
                                            value="Hill"
                                            onChange={() => {}}
                                        />
                                        <label htmlFor="hill">Hill</label>

                                        <input
                                            type="checkbox"
                                            id="other-categories"
                                            value="Other"
                                            onChange={() => {}}
                                        />
                                        <label htmlFor="other-categories">Other</label>
                                    </div>
                                </div>
                                <div className="login-input-group">
                                    <FaUser />
                                    <input
                                        type="text"
                                        placeholder="Price Range"
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(e.target.value)}
                                    />
                                </div>
                                <div className="login-input-group">
                                    <FaUser />
                                    <input
                                        type="text"
                                        placeholder="Description"
                                        value={accommodationDescription}
                                        onChange={(e) => setAccommodationDescription(e.target.value)}
                                    />
                                </div>
                                <div className="login-input-group">
                                    <FaUpload />
                                    <div>
                                        <label htmlFor="upload">Upload Image</label>
                                        <input
                                            id="upload"
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={handleImageUpload}
                                        />
                                    </div>
                                </div>
                                <div className="login-input-group">
                                    <FaPhone />
                                    <input
                                        type="text"
                                        placeholder="Contact Number"
                                        value={contactNumber}
                                        onChange={(e) => setContactNumber(e.target.value)}
                                    />
                                </div>
                                <div className="login-input-group">
                                    <FaEnvelope />
                                    <input
                                        type="text"
                                        placeholder="Address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>
                            </>
                        )}
                    </>
                )}

                <div className="login-inputs">
                    {action === "Login" ? null : (
                        <div className="login-input-group">
                            <FaUser />
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="login-input-group">
                        <FaEnvelope />
                        <input
                            type="email"
                            placeholder="Email Id"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="login-input-group">
                        <FaLock />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {showPassword ? (
                            <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />
                        ) : (
                            <FaEye onClick={() => setShowPassword(!showPassword)} />
                        )}
                    </div>

                    {action === "Sign Up" && (
                        <div className="login-input-group">
                            <FaLock />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {showPassword ? (
                                <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />
                            ) : (
                                <FaEye onClick={() => setShowPassword(!showPassword)} />
                            )}
                        </div>
                    )}
                </div>

                {action === "Sign Up" ? null : (
                    <div className="login-forgot-password">
                        Forgot Password? <span>Click Here!</span>
                    </div>
                )}

                <div className="login-submit-container">
                    <div
                        className={`login-submit ${action === "Login" ? "gray" : ""}`}
                        onClick={() => setAction("Sign Up")}
                    >
                        Sign Up
                    </div>
                    <div
                        className={`login-submit ${action === "Sign Up" ? "gray" : ""}`}
                        onClick={() => setAction("Login")}
                    >
                        Login
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
