import { Component } from "react";
import "./Footer.css";
import { FaFacebookF, FaTwitter, FaInstagram, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

class Footer extends Component {
    state = { clicked: false };

    handleClick = () => {
        this.setState({ clicked: !this.state.clicked });
    }

    render() {
        return (
            <footer id="footer">
                <div className="footer-container">
                    <div className="quick-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="index.html">Home</a></li>
                            <li><a href="support.html">Support</a></li>
                            <li><a href="about.html">About</a></li>
                            <li><a href="contact.html">Contact</a></li>
                            <li><a href="/Currency">Currency Converter</a></li>
                        </ul>
                    </div>
                    <div className="contact-details">
                        <h4>Contact Us</h4>
                        <ul>
                            <li>
                                <FaMapMarkerAlt /> 123 Travel Street, Colombo, Sri Lanka
                            </li>
                            <li>
                                <FaPhoneAlt /> +94 11 234 5678
                            </li>
                            <li>
                                <FaEnvelope /> ceyvoy@gmail.com
                            </li>
                        </ul>
                    </div>
                    <div className="social-links">
                        <h4>Follow Us</h4>
                        <ul>
                            <li>
                                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                                    <FaFacebookF /> Facebook
                                </a>
                            </li>
                            <li>
                                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                                    <FaTwitter /> Twitter
                                </a>
                            </li>
                            <li>
                                <a href="https://www.instagram.com/_ceyvoy_?igsh=Zjl2NTZ0bDU2eHIw" target="_blank" rel="noopener noreferrer">
                                    <FaInstagram /> Instagram
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2024 Travel Sri Lanka. All rights reserved.</p>
                </div>
            </footer>
        );
    }
}

export default Footer;
