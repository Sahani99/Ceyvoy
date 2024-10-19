import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { errorToast, successToast } from "@/lib/toastify";
import { useDispatch } from "react-redux";
import { setUserValue } from "@/state/user-slice";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [isNotVerified, setIsNotVerified] = useState(false);
  const navigate = useNavigate();
  // dispatcher
  const dispatch = useDispatch();

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
      password: "",
    });
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    await axios
      .post("/login", data)
      .then(({ data }) => {
        successToast(data.message);
        if (data?.user) dispatch(setUserValue(data?.user));
        // redirect
        navigate(data?.redirect || "/");
      })
      .catch((error) => {
        const data = error.response.data;
        // if error code 500 show error toast
        if (error.response.status === 500) {
          return errorToast(data.message);
        } else if (data.property === "not_verified") {
          setIsNotVerified(true);
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

  const handleResendVerification = async () => {
    setLoading(true);
    const data = new FormData();
    data.append("email", formData.email);
    await axios
      .post("/resend_verification", data)
      .then(({ data }) => {
        successToast(data.message);
        setIsNotVerified(false);
      })
      .catch((error) => {
        const data = error.response.data;
        errorToast(data.message);
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
          {!isNotVerified && (
            <form
              onSubmit={handleSubmit}
              onChange={handleChange}
              className="flex w-full flex-col items-center justify-center p-6 lg:w-1/2"
            >
              <h1 className="mb-1 w-full text-2xl font-medium text-gray-800">
                Sign in
              </h1>
              <p className="mb-3 w-full text-xs text-gray-600">
                Login to unlock the full experience and plan your next adventure
                with ease
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

              {/* password field */}
              <div className="mt-2 w-full">
                <Label
                  htmlFor="password"
                  className="flex w-full justify-between"
                >
                  <span>Password</span>
                  {/* forgot password */}
                  <Link
                    to={"/forgot-password"}
                    className="mb-1 text-xs font-medium text-gray-700 hover:text-sky-700"
                  >
                    Forgot password?
                  </Link>
                </Label>
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

              <Button
                disabled={loading}
                className="mt-4 w-full max-w-lg rounded-md bg-sky-700 px-4 py-2 text-white"
              >
                {loading ? "Loading..." : "Sign In"}
              </Button>

              {/* sign up link */}
              <p className="mt-4 text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  to="/sign-up"
                  className="ms-1 text-sky-700 hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </form>
          )}

          {/* not verified text and send verification code button */}
          {isNotVerified && (
            <div className="flex w-full flex-col flex-wrap items-center justify-center p-6 lg:w-1/2">
              <div className="text-sm text-red-500">
                Your account is not verified. Please verify your account by
                clicking link sent to your email
                <Button
                  type="button"
                  disabled={loading}
                  variant="ghost"
                  className="ms-2 p-0 text-emerald-700 hover:bg-transparent hover:underline"
                  onClick={handleResendVerification}
                >
                  {loading ? "Waiting..." : "Resend verification email"}
                </Button>
              </div>

              {/* login again */}
              <Button
                className="mt-4 w-full max-w-md rounded-md bg-sky-700 px-4 py-2 text-white"
                onClick={() => setIsNotVerified(false)}
              >
                Login with another account
              </Button>
            </div>
          )}

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

export default Login;
