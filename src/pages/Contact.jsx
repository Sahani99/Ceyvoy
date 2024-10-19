import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "axios";
import { errorToast, successToast } from "@/lib/toastify";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (formData) => {
    // validate form
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
    if (!formData.subject) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        subject: "Subject is required",
      }));
      return false;
    }
    if (!formData.message) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        message: "Message is required",
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
    // validate form
    validateForm(
      Object.assign({}, formData, {
        [e.target.name]: e.target.value,
      }),
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm(formData)) return;
    const data = new FormData();
    setIsSubmitting(true);
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("subject", formData.subject);
    data.append("message", formData.message);
    axios
      .post("/contact", data)
      .then(() => {
        successToast("Message sent successfully");
      })
      .catch(() => {
        errorToast("Failed to send message");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* header */}
      <Header />

      {/* contact */}
      <section className="container mx-auto mt-20 px-4 py-8">
        <h1 className="mb-8 text-center text-2xl font-medium md:text-3xl">
          Contact Us
        </h1>

        <div className="flex w-full flex-col gap-5 lg:flex-row">
          {/* contact form */}
          <form
            onSubmit={handleSubmit}
            onChange={handleChange}
            className="flex w-full flex-col items-center justify-center lg:w-1/2"
          >
            {/* name field */}
            <div className="w-full">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                maxLength="50"
                className="w-full rounded-md border border-gray-400/80 p-2"
              />
              {/* errors */}
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* email field */}
            <div className="mt-2 w-full">
              <Label htmlFor="email">Your Email</Label>
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

            {/* subject field */}
            <div className="mt-2 w-full">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                type="text"
                maxLength="100"
                placeholder="Subject of your message"
                className="w-full border-gray-400/80 p-2"
              />
              {/* errors */}
              {errors.subject && (
                <p className="text-sm text-red-500">{errors.subject}</p>
              )}
            </div>

            {/* message field */}
            <div className="mt-2 w-full">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                rows="10"
                maxLength="500"
                placeholder="Enter your message here"
                className="w-full border-gray-400/80 p-2"
              ></Textarea>
              {/* errors */}
              {errors.message && (
                <p className="text-sm text-red-500">{errors.message}</p>
              )}
            </div>

            <Button className="mt-4 w-full max-w-lg rounded-md bg-sky-700 px-4 py-2 text-white">
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
          {/* image */}
          <div className="hidden w-full items-center justify-center lg:flex lg:w-1/2">
            <img
              src="/images/slide01.jpg"
              alt="contact us"
              className="h-full w-full rounded-md object-cover"
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

export default Contact;
