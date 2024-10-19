import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import axios from "axios";
import RequireAuth from "./components/RequireAuth";
import "react-toastify/dist/ReactToastify.css";

// public pages
import Home from "@/pages/Home";
import NotFound from "./pages/NotFound";
import Gallery from "./pages/Gallery";
import Events from "./pages/Events";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Currency from "./pages/Currency";
import GetStart from "./pages/GetStart";
import BackToTop from "./components/BackToTop";
import CurrencyConvertor from "./components/CurrencyConvertor";
import { ToastContainer } from "react-toastify";
import Verification from "./pages/Verification";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// authorized pages
import Dashboard from "./pages/authorized/Dashboard";
import Settings from "./pages/authorized/Settings";
import { ROLES } from "./data/roles";
import Locations from "./pages/authorized/AdminLocations";
import RequestLocations from "./pages/authorized/GuideRequestLocations";
import LocationRequests from "./pages/authorized/AdminLocationRequests";
import GuideApprovals from "./pages/authorized/AdminGuideApprovals";
import GuideTravelRequests from "./pages/authorized/GuideTravelRequests";
import ReceivedFeedbacks from "./pages/authorized/ReceivedFeedbacks";
import Accounts from "./pages/authorized/Accounts";
import EventsAdmin from "./pages/authorized/AdminEvents";

function App() {
  // setup axios default base url
  axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;
  axios.defaults.withCredentials = true;
  return (
    <main>
      {/* react toastify toast container */}
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/events" element={<Events />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/currency" element={<Currency />} />

          {/* common auth routes */}
          <Route
            element={
              <RequireAuth
                allowedRoles={[
                  ROLES.Traveler,
                  ROLES.Guide,
                  ROLES.Accommodations,
                  ROLES.Admin,
                ]}
              />
            }
          >
            <Route path="/dashboard" element={<Outlet />}>
              <Route index element={<Dashboard />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>

          {/* traveler routes */}
          <Route element={<RequireAuth allowedRoles={[ROLES.Traveler]} />}>
            <Route path="get-start" element={<GetStart />} />
          </Route>

          {/* accommodations routes */}
          <Route
            element={<RequireAuth allowedRoles={[ROLES.Accommodations]} />}
          ></Route>

          {/* guide routes */}
          <Route element={<RequireAuth allowedRoles={[ROLES.Guide]} />}>
            <Route path="/dashboard" element={<Outlet />}>
              <Route path="request-locations" element={<RequestLocations />} />
              <Route path="guide-requests" element={<GuideTravelRequests />} />
              <Route path="received-feedback" element={<ReceivedFeedbacks />} />
            </Route>
          </Route>

          {/* admin routes */}
          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="/dashboard" element={<Outlet />}>
              <Route path="locations" element={<Locations />} />
              <Route path="location-requests" element={<LocationRequests />} />
              <Route path="guide-approval" element={<GuideApprovals />} />
              <Route path="system-feedback" element={<ReceivedFeedbacks />} />
              <Route path="accounts" element={<Accounts />} />
              <Route path="events" element={<EventsAdmin />} />
            </Route>
          </Route>

          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>

      {/* back to top */}
      <BackToTop />
      {/* currency convertor */}
      {/* <CurrencyConvertor /> */}
    </main>
  );
}

export default App;
