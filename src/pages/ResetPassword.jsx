import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { errorToast, successToast } from "@/lib/toastify";

// default values
const errorDefault = {
  password: "",
  confirmPassword: "",
};

const formDataDefault = {
  password: "",
  confirmPassword: "",
};

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState(formDataDefault);
  const [errors, setErrors] = useState(errorDefault);
  const [loading, setLoading] = useState({
    verify: true,
    reset: false,
  });
  const [isVerified, setIsVerified] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const code = searchParams.get("verify");

  const validateForm = (formData) => {
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

  // submit code to backend
  const handleVerify = useCallback(async () => {
    let formData = new FormData();
    formData.append("code", code);
    setLoading((prevLoading) => ({
      ...prevLoading,
      verify: true,
    }));
    await axios
      .post("/verify_reset_password", formData)
      .then(({ data }) => {
        if (data.status === 200) {
          setIsVerified(true);
          setEmail(data.email);
        }
      })
      .catch((error) => {
        errorToast(
          error.response.data.message ||
            "Something went wrong. Please try again.",
        );
      })
      .finally(() => {
        setLoading((prevLoading) => ({
          ...prevLoading,
          verify: false,
        }));
      });
  }, [code]);

  //submit new password to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(formData)) return;
    setLoading((prevLoading) => ({
      ...prevLoading,
      reset: true,
    }));
    // reset errors
    setErrors(errorDefault);
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    data.append("code", code);
    await axios
      .post("/reset_password", data)
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
        setLoading((prevLoading) => ({
          ...prevLoading,
          reset: false,
        }));
      });
  };

  // submit function run component mounting
  useEffect(() => {
    if (code !== "" && code !== null) handleVerify();
    else setLoading((prevLoading) => ({ ...prevLoading, verify: false }));
  }, [code, handleVerify]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* header */}
      <Header />

      {/* flex grow for fill space */}
      <div className="flex-grow" />
      <section className="container mx-auto mt-20 px-4 py-8">
        <div className="flex w-full flex-col gap-5 rounded-md border border-gray-300/60 bg-white shadow-sm drop-shadow-xl lg:flex-row">
          {/* login form */}
          {isVerified && (
            <form
              onSubmit={handleSubmit}
              onChange={handleChange}
              className="flex w-full flex-col items-center justify-center p-6 lg:w-4/5 xl:w-1/2"
            >
              <h1 className="mb-1 w-full text-2xl font-medium text-gray-800">
                Reset Password
              </h1>
              <p className="mb-3 w-full text-xs text-gray-600">
                Enter your new password to reset your account associated with{" "}
                {email}
              </p>

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
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                disabled={loading.reset}
                className="mt-4 w-full max-w-lg rounded-md bg-sky-700 px-4 py-2 text-white"
              >
                {loading.reset ? "Waiting..." : "Reset Password"}
              </Button>

              <p className="mt-4 text-sm text-gray-600">
                Try to sign in?
                <Link to="/login" className="ms-1 text-sky-700 hover:underline">
                  Login
                </Link>
              </p>
            </form>
          )}

          {!isVerified && (
            <div className="flex flex-col items-center justify-center p-6 lg:w-4/5 xl:w-1/2">
              {/* check query text is null or not */}
              {(code === "" || code === null) && (
                <p className="font-Poppins text-lg">
                  Verification code is empty.
                </p>
              )}

              {/* if loading show loading text */}
              {loading.verify && (
                <p className="font-Poppins text-lg">Loading...</p>
              )}
            </div>
          )}
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

export default ResetPassword;
