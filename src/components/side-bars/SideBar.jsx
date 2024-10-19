/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { RiMenu2Fill } from "react-icons/ri";
import { resetUserValue, setUserValue } from "../../state/user-slice";
import { CgLogOut } from "react-icons/cg";
import { IoCloseSharp } from "react-icons/io5";
import { FaPen } from "react-icons/fa";
import { errorToast, successToast } from "../../lib/toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { MdFeedback } from "react-icons/md";
import Brand from "../Brand";
import { cn } from "@/lib/utils";
import { ROLES } from "@/data/roles";

const Sidebar = ({ urls }) => {
  const { user } = useSelector((state) => state.user);
  const isAdmin = user?.role === ROLES.Admin || false;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { pathname } = location;
  const sidebarRef = useRef();

  const logout = () => {
    axios.post("/logout").then(() => {
      dispatch(resetUserValue());
      navigate("/login");
    });
  };

  const updateProfileImage = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("profileImage", file);
    formData.append("type", "profileImage");
    await axios
      .post("/update_account", formData)
      .then(({ data }) => {
        successToast("Profile image updated successfully");
        dispatch(setUserValue(data?.user));
      })
      .catch(() => {
        errorToast("Failed to update profile image");
      });
  };

  // use effect for sidebar hidden when user click the outside of the side bar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    // Add click event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Remove event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarRef]);

  return (
    <div className="">
      <div className="absolute flex w-full justify-between border-b bg-white px-2 py-2.5 shadow-sm drop-shadow-2xl lg:justify-start lg:py-4 lg:ps-80">
        {/* brand */}
        <Link to="/">
          <Brand />
        </Link>

        {/* button for toggle */}
        <button
          data-drawer-target="default-sidebar"
          data-drawer-toggle="default-sidebar"
          aria-controls="default-sidebar"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          type="button"
          className={cn(
            "inline-flex items-center rounded-lg p-2 text-sm outline-none duration-300 lg:hidden",
            isSidebarOpen && "scale-0",
          )}
        >
          <RiMenu2Fill className="h-7 w-7 text-sky-700" />
        </button>
      </div>

      {/* submit feedback pop up */}
      <SubmitFeedback isOpen={isFeedbackOpen} setIsOpen={setIsFeedbackOpen} />

      {/* sidebar */}
      <aside
        ref={sidebarRef}
        id="default-sidebar"
        className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed left-0 top-0 z-40 h-screen w-72 transition-transform lg:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="flex h-full flex-col overflow-y-auto bg-sky-950 px-3 py-4">
          {/* close icon for small devices */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="self-end text-white lg:hidden"
          >
            <IoCloseSharp className="h-5 w-5" />
          </button>
          {/* profile image and name */}
          <div className="mb-4 mt-3 flex flex-col items-center border-b border-sky-400 pb-4">
            {/* if image url is null */}
            {user?.profileImage == null && (
              <div className="relative">
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-sky-500 text-7xl text-white">
                  {user?.name.charAt(0)}
                </div>
                <label htmlFor="profile-image">
                  <input
                    type="file"
                    id="profile-image"
                    className="peer sr-only"
                    accept="image/*"
                    onChange={updateProfileImage}
                  />
                  <div className="absolute bottom-1 right-2 h-8 w-8 cursor-pointer rounded-full bg-sky-700 p-2 text-white">
                    <FaPen />
                  </div>
                </label>
              </div>
            )}
            {/* if image url is not null */}
            {user?.profileImage != null && (
              <div className="relative">
                <img
                  src={
                    import.meta.env.VITE_APP_API_URL +
                    user?.profileImage +
                    `?${new Date().getSeconds()}`
                  }
                  alt={user?.name.charAt(0)}
                  className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-sky-500 bg-sky-500 text-7xl text-white"
                />
                <label htmlFor="profile-image">
                  <input
                    type="file"
                    id="profile-image"
                    className="peer sr-only"
                    accept="image/*"
                    onChange={updateProfileImage}
                  />
                  <div className="absolute bottom-1 right-2 h-8 w-8 cursor-pointer rounded-full bg-sky-700 p-2 text-white">
                    <FaPen />
                  </div>
                </label>
              </div>
            )}
            {/* name  */}
            <p className="mb-1 mt-3 font-medium text-white">{user?.name}</p>
            {/* role */}
            <p className="rounded-full border border-sky-300 bg-sky-600 px-4 py-0.5 text-xs font-medium capitalize text-white">
              {user?.role.toLowerCase()}
            </p>
          </div>
          {/* side links */}
          <ul className="space-y-2 font-medium">
            {urls?.map((url, index) => {
              return (
                <li key={index}>
                  <Link
                    to={url.link}
                    className={`group flex items-center rounded-lg p-2 text-white ${pathname === url.link ? "bg-sky-600 hover:bg-sky-700" : "hover:bg-sky-500/30"}`}
                  >
                    {url.icon}
                    <span className="ms-2">{url.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          {/* flex grow */}
          <div className="flex flex-grow flex-col" />
          {/* logout */}
          <div className="flex items-center justify-between border-t border-sky-400 px-2 pt-6">
            <button
              onClick={logout}
              className="flex items-center gap-x-2 font-medium text-white hover:text-sky-300"
            >
              <CgLogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
            {/* issues */}
            {!isAdmin && (
              <button
                onClick={() => setIsFeedbackOpen(true)}
                className="flex items-center gap-x-2 font-medium text-white hover:text-sky-300"
              >
                Feedback
                <MdFeedback />
              </button>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};

const SubmitFeedback = ({ isOpen, setIsOpen }) => {
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // if feedback is empty
    if (!feedback || feedback.length < 1) {
      return errorToast("Feedback is required");
    }
    const data = new FormData();
    data.append("feedback", feedback);
    data.append("type" , "SYSTEM");
    setLoading(true);
    await axios
      .post("/feedbacks", data)
      .then(() => {
        successToast("Feedback submitted successfully");
        setIsOpen(false);
        setFeedback("");
      })
      .catch((err) => {
        if (err?.response?.data?.message) errorToast(err.response.data.message);
        else errorToast("Failed to submit feedback");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Submit Feedback</DialogTitle>
          <DialogDescription className="text-xs font-medium">
            Please describe your feedback in detail so that we can help you
            better.
          </DialogDescription>
        </DialogHeader>

        {/* feedback */}
        <div className="mt-3 grid gap-2">
          <Label
            htmlFor="feedback"
            className="flex items-center justify-between"
          >
            Feedback
            {/* letter count */}
            <span className="text-sm text-gray-500">
              {feedback?.length || 0}/1000
            </span>
          </Label>
          <Textarea
            id="feedback"
            className="border-gray-400/80"
            value={feedback}
            maxLength={1000}
            onChange={(e) => setFeedback(e.target.value)}
            rows={8}
            placeholder="Write your feedback here"
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            className="bg-sky-600 text-white hover:bg-sky-700"
            onClick={handleSubmit}
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Sidebar;
