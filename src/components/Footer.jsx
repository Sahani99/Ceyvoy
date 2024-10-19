import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full text-blue-800 border-t border-t-black/10">
      <div className="flex w-full flex-wrap justify-center gap-10 bg-white px-5 py-10">
        <Link to="/" className="text-sm hover:text-blue-950">
          Home
        </Link>
        <Link to="/about-us" className="text-sm hover:text-blue-950">
          About Us
        </Link>
        <Link to="/contact-us" className="text-sm hover:text-blue-950">
          Contact Us
        </Link>
        <Link to="/login" className="text-sm hover:text-blue-950">
          Login
        </Link>
        <Link to="/sign-up" className="text-sm hover:text-blue-950">
          Register
        </Link>
        <Link to="/get-start" className="text-sm hover:text-blue-950">
          Get Started
        </Link>
      </div>

      <div className="border-t border-blue-500 bg-sky-600 py-3 text-sm">
        <div className="col-span-2 text-center text-white md:col-span-4 lg:col-span-6">
          Copyright 2024 Ceyvoy
        </div>
      </div>
    </footer>
  );
};

export default Footer;
