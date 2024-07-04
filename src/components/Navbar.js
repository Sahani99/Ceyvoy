import React, { useState, useEffect } from "react";
import "./Navbar.css";

const NavbarElements = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const links = document.querySelectorAll("#NavbarElements li");

    const handleHamburgerClick = () => {
      setIsOpen(!isOpen);
      links.forEach((link) => {
        link.classList.toggle("fade");
      });
    };

    const hamburger = document.querySelector(".hamburger");
    hamburger.addEventListener("click", handleHamburgerClick);

    return () => {
      hamburger.removeEventListener("click", handleHamburgerClick);
    };
  }, [isOpen]);

  return (
    <nav>
      <a href="index.html">
        {/* <img src={logo} alt="Logo" className="Logo" />; update after logo designed */}
      </a>
      <div className={`hamburger ${isOpen ? "toggle" : ""}`}>
        <div className="line1"></div>
        <div className="line2"></div>
        <div className="line3"></div>
      </div>
      <ul id="NavbarElements" className={isOpen ? "open" : ""}>
        <li>
          <a href="Home.js">Home</a>
        </li>
        <li>
          <a href="Gallery.js">Gallery</a>
        </li>
        <li>
          <a href="Event.js">Event</a>
        </li>
        <li>
          <a href="About.js">About</a>
        </li>
        <li>
          <a href="Contact.js">Contact</a>
        </li>
        <li>
          <a href="profile.html">Profile</a>
        </li>
        <li>
          <a href="./Login.js">Login</a>
        </li>
      </ul>
    </nav>
  );
};

export default NavbarElements;
