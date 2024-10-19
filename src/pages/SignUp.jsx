import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import axios from "axios";
import { errorToast, successToast } from "@/lib/toastify";

// default values
const errorDefault = {
  role: "",
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const formDataDefault = {
  role: "TRAVELER",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignUp = () => {
  const [formData, setFormData] = useState(formDataDefault);
  const [errors, setErrors] = useState(errorDefault);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = (formData) => {
    // validate form
    if (!formData.role) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        role: "Role is required",
      }));
      return false;
    }
    if (!formData.name) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Name is required",
      }));
      return false;
    }
    if (!formData.email) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email is required",
      }));
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email",
      }));
      return false;
    }
    if (!formData.password) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password is required",
      }));
      return false;
    }
    if (formData.password.length < 8) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must be at least 8 characters",
      }));
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Passwords do not match",
      }));
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
    // reset errors
    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(formData)) return;
    setLoading(true);
    // reset errors
    setErrors(errorDefault);
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    await axios
      .post("/sign_up", data)
      .then(({ data }) => {
        successToast(data.message);
        setFormData(formDataDefault);
        // redirect to login page
        navigate("/login");
      })
      .catch((error) => {
        const data = error.response.data;
        // if error code 500 show error toast
        if (error.response.status === 500) {
          return errorToast(data.message);
        }
        // set errors
        setErrors((prevErrors) => ({
          ...prevErrors,
          [data?.property]: data.message,
        }));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* header */}
      <Header />

      {/* flex grow for fill space */}
      <div className="flex-grow" />
      <section className="container mx-auto mt-20 px-4 py-8">
        <div className="flex w-full flex-col gap-5 rounded-md border border-gray-300/60 bg-white shadow-sm drop-shadow-xl lg:flex-row">
          {/* login form */}
          <form
            onSubmit={handleSubmit}
            onChange={handleChange}
            className="flex w-full flex-col items-center justify-center p-6 lg:w-4/5 xl:w-1/2"
          >
            <h1 className="mb-1 w-full text-2xl font-medium text-gray-800">
              Sign Up
            </h1>
            <p className="mb-3 w-full text-xs text-gray-600">
              Create an account to plan a new trip
            </p>

            {/* role */}
            <div className="w-full">
              <Label>Register as</Label>
              <div className="flex w-full flex-col gap-1 sm:flex-row">
                {["TRAVELER", "GUIDE", "ACCOMMODATIONS"].map((role) => (
                  <label key={role} htmlFor={role} className="w-full">
                    <input
                      checked={formData.role === role}
                      onChange={handleChange}
                      type="radio"
                      id={role}
                      name="role"
                      value={role}
                      className="peer sr-only"
                    />
                    <div className="flex h-10 w-full cursor-pointer items-center justify-center rounded-md bg-gray-700 p-2 text-center text-sm font-medium capitalize text-white peer-checked:bg-sky-700">
                      {role.toLowerCase()}
                      {formData.role === role && (
                        <CheckCircle className="ms-2 inline-block h-5 w-5" />
                      )}
                    </div>
                  </label>
                ))}
              </div>
              {/* errors */}
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role}</p>
              )}
            </div>

            {/* name field */}
            <div className="mt-2 w-full">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                maxLength="50"
                placeholder="John Doe"
                className="w-full border-gray-400/80 p-2"
              />
              {/* errors */}
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* email field */}
            <div className="mt-2 w-full">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                maxLength="50"
                placeholder="john@example.com"
                className="w-full border-gray-400/80 p-2"
              />
              {/* errors */}
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* password field */}
            <div className="mt-2 w-full">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                maxLength="100"
                placeholder="********"
                className="w-full border-gray-400/80 p-2"
              />
              {/* errors */}
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* confirm password field */}
            <div className="mt-2 w-full">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                maxLength="100"
                placeholder="********"
                className="w-full border-gray-400/80 p-2"
              />
              {/* errors */}
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            <Button
              disabled={loading}
              className="mt-4 w-full max-w-lg rounded-md bg-sky-700 px-4 py-2 text-white"
            >
              {loading ? "Waiting..." : "Sign Up"}
            </Button>

            <p className="mt-4 text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="ms-1 text-sky-700 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
          {/* image */}
          <div className="hidden min-h-[35rem] w-full items-center justify-center lg:flex lg:w-1/2">
            <img
              src="/images/slide04.jpeg"
              alt="contact us"
              className="h-full w-full rounded-r-md object-cover"
            />
          </div>
        </div>
      </section>

      {/* flex grow for fill space */}
      <div className="flex-grow" />

      {/* footer */}
      <Footer />
    </div>
  );
};

export default SignUp;
