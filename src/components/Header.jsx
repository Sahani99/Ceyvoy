import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetUserValue, setUserValue } from "../state/user-slice";
import { Link } from "react-router-dom";
import Brand from "./Brand";

const links = [
  {
    title: "Gallery",
    url: "/gallery",
  },
  {
    title: "Events",
    url: "/events",
  },
  {
    title: "About Us",
    url: "/about-us",
  },
  {
    title: "Contact Us",
    url: "/contact-us",
  },
];

const Header = () => {
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const loadUser = useCallback(async () => {
    if (user !== null) {
      return;
    }
    if (!user) {
      axios
        .get("/authorize")
        .then(async ({ data }) => {
          if (data?.user) dispatch(setUserValue(data?.user));
        })
        .catch(() => {
          dispatch(resetUserValue());
        });
    }
  }, [dispatch, user]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <header className="fixed z-20 w-full border-b border-black/10 bg-white/90 backdrop-blur-sm">
      <div className="relative mx-auto max-w-full px-6 lg:max-w-5xl xl:max-w-6xl">
        <nav
          className="flex h-[3.5rem] items-center justify-between font-medium text-blue-500 sm:h-[4rem]"
          role="navigation"
        >
          {/*Brand logo */}
          <Link className="relative" to="/">
            <Brand />
          </Link>

          {/* Mobile trigger */}
          <button
            className={`relative order-10 block h-10 w-10 self-center lg:hidden${
              isToggleOpen
                ? "visible opacity-100 [&_span:nth-child(1)]:w-6 [&_span:nth-child(1)]:translate-y-0 [&_span:nth-child(1)]:rotate-45 [&_span:nth-child(2)]:-rotate-45 [&_span:nth-child(3)]:w-0"
                : ""
            }`}
            onClick={() => setIsToggleOpen(!isToggleOpen)}
            aria-expanded={isToggleOpen ? "true" : "false"}
          >
            <div className="absolute left-1/2 top-1/2 w-6 -translate-x-1/2 -translate-y-1/2 transform">
              <span
                aria-hidden="true"
                className="absolute block h-0.5 w-9/12 -translate-y-2 transform rounded-full bg-blue-400 transition-all duration-300"
              ></span>
              <span
                aria-hidden="true"
                className="absolute block h-0.5 w-6 transform rounded-full bg-blue-400 transition duration-300"
              ></span>
              <span
                aria-hidden="true"
                className="absolute block h-0.5 w-1/2 origin-top-left translate-y-2 transform rounded-full bg-blue-400 transition-all duration-300"
              ></span>
            </div>
          </button>

          {/* Navigation links */}
          <ul
            role="menubar"
            aria-label="Select page"
            className={`absolute left-0 top-0 z-[-1] h-fit w-full justify-center overflow-hidden overflow-y-auto overscroll-contain bg-white px-8 pb-5 pt-20 font-medium backdrop-blur-md transition-[opacity,visibility] duration-300 lg:visible lg:relative lg:top-0 lg:z-0 lg:flex lg:h-full lg:w-auto lg:items-stretch lg:overflow-visible lg:px-0 lg:py-0 lg:pt-0 lg:opacity-100 ${
              isToggleOpen
                ? "visible border-b border-b-blue-700/20 opacity-100 backdrop-blur-sm"
                : "invisible opacity-0"
            }`}
          >
            {links.map((link, index) => {
              return (
                <li key={index} role="none" className="flex items-stretch">
                  <Link
                    role="menuitem"
                    className="flex items-center gap-2 py-3 transition-colors duration-300 hover:text-blue-700 focus:text-blue-600 focus:outline-none focus-visible:outline-none lg:px-8"
                    to={link.url}
                  >
                    <span>{link.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* login button or user image */}
          <div className="flex w-full items-center justify-end px-6 lg:ml-0 lg:w-auto lg:p-0">
            {user && (
              <Link to={"/dashboard"}>
                <div className="flex min-h-[2rem] w-full min-w-0 flex-col items-start justify-center gap-0 text-center">
                  {/* if image url is null */}
                  {user?.profileImage == null && (
                    <div className="relative">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-2xl text-white">
                        {user?.name.charAt(0)}
                      </div>
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
                        className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-sky-500 bg-sky-500 text-7xl text-white"
                      />
                    </div>
                  )}
                </div>
              </Link>
            )}

            {!user && (
              <div className="flex items-center">
                <Link to="/login">
                  <button className="inline-flex h-8 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-blue-500 px-4 text-sm font-medium tracking-wide text-white duration-300 hover:bg-blue-600">
                    <span>Sign in</span>
                  </button>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
