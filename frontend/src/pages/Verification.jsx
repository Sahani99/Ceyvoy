/* eslint-disable react/prop-types */
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import axios from "axios";
import { CheckCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { MdError } from "react-icons/md";
import { Link, useSearchParams } from "react-router-dom";

const Verification = () => {
  const [searchParams] = useSearchParams();
  const [isVerified, setIsVerified] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const code = searchParams.get("verify");

  // submit code to backend
  const handleVerify = useCallback(async () => {
    let formData = new FormData();
    formData.append("code", code);
    setLoading(true);
    await axios
      .post("/verify_email", formData)
      .then(({ data }) => {
        if (data.status === 200) {
          setIsVerified(true);
          setIsError(false);
        }
      })
      .catch((error) => {
        setIsError(true);
        setIsVerified(false);
        if (error?.response?.data?.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("Something went wrong. Please try again.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [code]);

  // submit function run component mounting
  useEffect(() => {
    if (code !== "" && code !== null) handleVerify();
    else setLoading(false);
  }, [code, handleVerify]);

  return (
    <div className="flex min-h-screen flex-col">
      {/* header */}
      <Header />

      {/* flex grow for fill space */}
      <div className="flex-grow" />

      <section className="container mx-auto mt-20 flex flex-col items-center justify-center px-4 py-8">
        {/* check query text is null or not */}
        {(code === "" || code === null) && (
          <p className="font-Poppins text-lg">Verification code is empty.</p>
        )}

        {/* if loading show loading text */}
        {loading && <p className="font-Poppins text-lg">Loading...</p>}

        {/* if account verified show success message */}
        {isVerified && !loading && <NewAccVerify />}

        {/* if error show error message */}
        {isError && !loading && <ErrorText errorMessage={errorMessage} />}
      </section>

      {/* flex grow for fill space */}
      <div className="flex-grow" />

      {/* footer */}
      <Footer />
    </div>
  );
};

// success text
const NewAccVerify = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <CheckCircle size={72} className="inline-block text-emerald-600" />
      <p className="my-5 font-Poppins text-lg">
        Your Account has been confirmed successfully. Thank you!
      </p>
      <Link
        to="/login"
        className="w-fit rounded-md bg-sky-600 px-20 py-1.5 text-white hover:bg-sky-700"
      >
        Login
      </Link>
    </div>
  );
};

// error text
const ErrorText = ({ errorMessage }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <MdError size={72} className="inline-block text-red-600" />
      <p className="mb-5 font-Poppins text-lg">
        {errorMessage || "Something went wrong. Please try again."}
      </p>
      <Link
        to="/"
        className="w-fit rounded-md bg-sky-600 px-20 py-1.5 text-white hover:bg-sky-700"
      >
        Home
      </Link>
    </div>
  );
};

export default Verification;
