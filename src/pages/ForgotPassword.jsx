import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { errorToast, successToast } from "@/lib/toastify";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const validateForm = (formData) => {
    // validate form
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
    setErrors({
      email: "",
    });
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    await axios
      .post("/forgot_password", data)
      .then(({ data }) => {
        successToast(data.message);
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
          {/* forgot password form */}

          <form
            onSubmit={handleSubmit}
            onChange={handleChange}
            className="flex w-full flex-col items-center justify-center p-6 lg:w-1/2"
          >
            <h1 className="mb-1 w-full text-2xl font-medium text-gray-800">
              Forgot Password
            </h1>
            <p className="mb-3 w-full text-xs text-gray-600">
              Enter your email address to reset your password
            </p>

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

            <Button
              disabled={loading}
              className="mt-4 w-full max-w-lg rounded-md bg-sky-700 px-4 py-2 text-white"
            >
              {loading ? "Loading..." : "Send Reset Link"}
            </Button>

            {/* sign up link */}
            <p className="mt-4 text-sm text-gray-600">
              Try to login?{" "}
              <Link to="/sign-up" className="ms-1 text-sky-700 hover:underline">
                Login
              </Link>
            </p>
          </form>

          {/* image */}
          <div className="hidden min-h-[30rem] w-full items-center justify-center lg:flex lg:w-1/2">
            <img
              src="/images/slide01.jpg"
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

export default ForgotPassword;
