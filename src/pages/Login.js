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
    const [category, setCategory] = useState([]);
    const [priceRange, setPriceRange] = useState("");
    const [accommodationDescription, setAccommodationDescription] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [address, setAddress] = useState("");
    const [uploadedImages, setUploadedImages] = useState([]);

    const handleRoleSelect = (selectedRole) => {
        setRole(selectedRole);
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setLicenseNumber("");
        setDescription("");
        setSpokenLanguages([]);
        setCategory([]);
        setPriceRange("");
        setAccommodationDescription("");
        setContactNumber("");
        setAddress("");
        setUploadedImages([]);
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

    const handleCategorySelect = (cat) => {
        const updatedCategories = [...category];
        if (updatedCategories.includes(cat)) {
            updatedCategories.splice(updatedCategories.indexOf(cat), 1);
        } else {
            updatedCategories.push(cat);
        }
        setCategory(updatedCategories);
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const urls = files.map((file) => file.name);
        setUploadedImages((prevImages) => [...prevImages, ...urls]);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const isDisabled = role === "";

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <div className="login-text">{action}</div>
                    <div className="login-underline"></div>
                </div>

                <div className="toggle-action">
                    <button onClick={() => setAction("Login")}>Login</button>
                    <button onClick={() => setAction("Sign Up")}>Sign Up</button>
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

                        {!role && <div className="role-warning">Please select a role to continue</div>}

                        {role === "Tourguide" && (
                            <>
                                <div className="login-input-group">
                                    <FaUser />
                                    <input
                                        type="text"
                                        placeholder="License Number"
                                        value={licenseNumber}
                                        onChange={(e) => setLicenseNumber(e.target.value)}
                                        disabled={isDisabled}
                                    />
                                </div>
                                <div className="login-input-group">
                                    <FaUser />
                                    <input
                                        type="text"
                                        placeholder="Description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        disabled={isDisabled}
                                    />
                                </div>
                                <div className="login-input-group">
                                    <FaUpload />
                                    <div className="upload-container">
                                        <label htmlFor="upload" className="upload-label">Choose File</label>
                                        <input
                                            id="upload"
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={handleImageUpload}
                                            disabled={isDisabled}
                                        />
                                        {uploadedImages.map((image, index) => (
                                            <span key={index} className="uploaded-image-name">{image}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="login-input-group">
                                    <FaUser />
                                    <h4>Spoken Languages</h4>
                                    <div className="login-checkbox-container">
                                        <div>
                                            <input
                                                type="checkbox"
                                                id="english"
                                                value="English"
                                                onChange={() => handleLanguageSelect("English")}
                                                disabled={isDisabled}
                                            />
                                            <label htmlFor="english">English</label>
                                        </div>
                                        <div>
                                            <input
                                                type="checkbox"
                                                id="sinhala"
                                                value="Sinhala"
                                                onChange={() => handleLanguageSelect("Sinhala")}
                                                disabled={isDisabled}
                                            />
                                            <label htmlFor="sinhala">Sinhala</label>
                                        </div>
                                        <div>
                                            <input
                                                type="checkbox"
                                                id="hindi"
                                                value="Hindi"
                                                onChange={() => handleLanguageSelect("Hindi")}
                                                disabled={isDisabled}
                                            />
                                            <label htmlFor="hindi">Hindi</label>
                                        </div>
                                        <div>
                                            <input
                                                type="checkbox"
                                                id="other-languages"
                                                value="Other"
                                                onChange={() => handleLanguageSelect("Other")}
                                                disabled={isDisabled}
                                            />
                                            <label htmlFor="other-languages">Other</label>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {role === "Accommodation" && (
                            <>
                                <div className="login-input-group">
                                    <FaUser />
                                    <h4>Categories</h4>
                                    <div className="login-checkbox-container">
                                        <div>
                                            <input
                                                type="checkbox"
                                                id="luxury"
                                                value="Luxury"
                                                onChange={() => handleCategorySelect("Luxury")}
                                                disabled={isDisabled}
                                            />
                                            <label htmlFor="luxury">Luxury</label>
                                        </div>
                                        <div>
                                            <input
                                                type="checkbox"
                                                id="beach"
                                                value="Beach"
                                                onChange={() => handleCategorySelect("Beach")}
                                                disabled={isDisabled}
                                            />
                                            <label htmlFor="beach">Beach</label>
                                        </div>
                                        <div>
                                            <input
                                                type="checkbox"
                                                id="hill"
                                                value="Hill"
                                                onChange={() => handleCategorySelect("Hill")}
                                                disabled={isDisabled}
                                            />
                                            <label htmlFor="hill">Hill</label>
                                        </div>
                                        <div>
                                            <input
                                                type="checkbox"
                                                id="other-categories"
                                                value="Other"
                                                onChange={() => handleCategorySelect("Other")}
                                                disabled={isDisabled}
                                            />
                                            <label htmlFor="other-categories">Other</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="login-input-group">
                                    <FaUser />
                                    <select
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(e.target.value)}
                                        disabled={isDisabled}
                                    >
                                        <option value="">Select Price Range</option>
                                        <option value="10-40">$10 - $40</option>
                                        <option value="40-60">$40 - $60</option>
                                        <option value="70-100">$70 - $100</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="login-input-group">
                                    <FaUser />
                                    <input
                                        type="text"
                                        placeholder="Description"
                                        value={accommodationDescription}
                                        onChange={(e) => setAccommodationDescription(e.target.value)}
                                        disabled={isDisabled}
                                    />
                                </div>
                                <div className="login-input-group">
                                    <FaUpload />
                                    <div className="upload-container">
                                        <label htmlFor="upload" className="upload-label">Choose File</label>
                                        <input
                                            id="upload"
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={handleImageUpload}
                                            disabled={isDisabled}
                                        />
                                        {uploadedImages.map((image, index) => (
                                            <span key={index} className="uploaded-image-name">{image}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="login-input-group">
                                    <FaPhone />
                                    <input
                                        type="text"
                                        placeholder="Contact Number"
                                        value={contactNumber}
                                        onChange={(e) => setContactNumber(e.target.value)}
                                        disabled={isDisabled}
                                    />
                                </div>

                                <div className="login-input-group">
                                    <FaEnvelope />
                                    <input
                                        type="text"
                                        placeholder="Address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        disabled={isDisabled}
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
                                disabled={isDisabled}
                            />
                        </div>
                    )}

                    <div className="login-input-group">
                        <FaEnvelope />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isDisabled}
                        />
                    </div>

                    <div className="login-input-group">
                        <FaLock />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isDisabled}
                        />
                        <span className="password-toggle" onClick={togglePasswordVisibility}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    {action === "Sign Up" && (
                        <div className="login-input-group">
                            <FaLock />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={isDisabled}
                            />
                        </div>
                    )}

                    <div className="login-button-group">
                        <button className="login-button">{action}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
