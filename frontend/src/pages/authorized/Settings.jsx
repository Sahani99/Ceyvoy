import SideBarForRole from "@/components/side-bars/SideBarForRole";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { errorToast, successToast } from "@/lib/toastify";
import { resetUserValue, setUserValue } from "@/state/user-slice";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// default values
const errorDefault = {
  currentPassword: "",
  password: "",
  confirmPassword: "",
  name: "",
  email: "",
};

const Settings = () => {
  const { user } = useSelector((state) => state.user);
  const formDataDefault = {
    currentPassword: "",
    password: "",
    confirmPassword: "",
    name: user?.name || "",
    email: user?.email || "",
  };
  const [formData, setFormData] = useState(formDataDefault);
  const [errors, setErrors] = useState(errorDefault);
  const [loading, setLoading] = useState({
    password: false,
    name: false,
    email: false,
  });
  const navigate = useNavigate();
  // dispatcher
  const dispatch = useDispatch();

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

  // validate password form
  const validatePasswordForm = (formData) => {
    if (!formData.currentPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        currentPassword: "Current password is required",
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
      return;
    }
    if (formData.password === formData.currentPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "New password must be different from the current password",
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

  // validate name form
  const validateNameForm = (formData) => {
    if (!formData.name) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Name is required",
      }));
      return false;
    }
    if (formData.name.length < 3) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "Name must be at least 3 characters",
      }));
      return false;
    }
    if (formData.name === user.name) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: "New name must be different from the current name",
      }));
      return false;
    }
    return true;
  };

  // validate email form
  const validateEmailForm = (formData) => {
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

    if (formData.email === user.email) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "New email must be different from the current email",
      }));
      return false;
    }
    return true;
  };

  //submit new password to backend
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm(formData)) return;

    setLoading((prevLoading) => ({
      ...prevLoading,
      password: true,
    }));
    // reset errors
    setErrors(errorDefault);
    const data = new FormData();
    data.append("currentPassword", formData.currentPassword);
    data.append("password", formData.password);
    data.append("confirmPassword", formData.confirmPassword);
    data.append("type", "password");
    await axios
      .post("/update_account", data)
      .then(({ data }) => {
        successToast(data.message);
        setFormData(formDataDefault);
        // reset state values
        dispatch(resetUserValue());
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
          password: false,
        }));
      });
  };

  // submit new name to backend
  const handleChangeName = async (e) => {
    e.preventDefault();
    if (!validateNameForm(formData)) return;
    setLoading((prevLoading) => ({
      ...prevLoading,
      name: true,
    }));
    // reset errors
    setErrors(errorDefault);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("type", "name");
    await axios
      .post("/update_account", data)
      .then(({ data }) => {
        successToast(data.message);
        if (data?.user) dispatch(setUserValue(data?.user));
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
          name: false,
        }));
      });
  };

  // submit new email to backend
  const handleChangeEmail = async (e) => {
    e.preventDefault();
    if (!validateEmailForm(formData)) return;
    setLoading((prevLoading) => ({
      ...prevLoading,
      email: true,
    }));
    // reset errors
    setErrors(errorDefault);
    const data = new FormData();
    data.append("email", formData.email);
    data.append("type", "email");
    await axios
      .post("/update_account", data)
      .then(({ data }) => {
        successToast(data.message);
        setFormData(formDataDefault);
        // reset state values
        dispatch(resetUserValue());
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
          email: false,
        }));
      });
  };

  return (
    <div className="w-full">
      {/* sidebar */}
      <SideBarForRole />

      {/* main content */}
      <div className="flex min-h-screen w-full items-center justify-center px-4 py-16 lg:ms-72 lg:w-[calc(100%_-_18rem)]">
        <div className="my-10 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-3 xl:gap-8">
          {/*change password  */}
          <form
            onSubmit={handleChangePassword}
            onChange={handleChange}
            className="flex h-fit w-full flex-col items-center justify-center rounded-md bg-white p-6 shadow-sm drop-shadow-lg md:row-span-2"
          >
            <h1 className="mb-1 w-full text-2xl font-medium text-gray-800">
              Change Password
            </h1>
            <p className="mb-3 w-full text-xs text-gray-600">
              Please enter your current password and new password to change your
              password.
            </p>

            {/* current password field */}
            <div className="mt-2 w-full">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                maxLength="100"
                placeholder="********"
                className="w-full border-gray-400/80 p-2"
              />
              {/* errors */}
              {errors.currentPassword && (
                <p className="text-sm text-red-500">{errors.currentPassword}</p>
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
              disabled={loading.password}
              className="mt-4 w-full max-w-lg rounded-md bg-sky-700 px-4 py-2 text-white"
            >
              {loading.password ? "Changing..." : "Change Password"}
            </Button>
          </form>

          {/* change name */}
          <form
            onSubmit={handleChangeName}
            className="flex w-full flex-col items-center justify-center rounded-md bg-white p-6 shadow-sm drop-shadow-lg"
          >
            <h1 className="mb-1 w-full text-2xl font-medium text-gray-800">
              Change Username
            </h1>
            <p className="mb-3 w-full text-xs text-gray-600">
              Please enter your new username to change your username.
            </p>

            {/* name field */}
            <div className="mt-2 w-full">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                maxLength="100"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border-gray-400/80 p-2"
              />
              {/* errors */}
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <Button
              disabled={loading.name}
              className="mt-4 w-full max-w-lg rounded-md bg-sky-700 px-4 py-2 text-white"
            >
              {loading.name ? "Changing..." : "Change Name"}
            </Button>
          </form>

          {/* change email */}
          <form
            onSubmit={handleChangeEmail}
            className="flex w-full flex-col items-center justify-center rounded-md bg-white p-6 shadow-sm drop-shadow-lg"
          >
            <h1 className="mb-1 w-full text-2xl font-medium text-gray-800">
              Change Email
            </h1>
            <p className="mb-3 w-full text-xs text-gray-600">
              Please enter your new email to change your email.
            </p>

            {/* email field */}
            <div className="mt-2 w-full">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                maxLength="100"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full border-gray-400/80 p-2"
              />
              {/* errors */}
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <Button
              disabled={loading.email}
              className="mt-4 w-full max-w-lg rounded-md bg-sky-700 px-4 py-2 text-white"
            >
              {loading.email ? "Changing..." : "Change Email"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
