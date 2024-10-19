import {
  MdAccountBox,
  MdApproval,
  MdDashboard,
  MdLocationCity,
  MdOutlineFeedback,
  MdTravelExplore,
} from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import Sidebar from "./SideBar";
import { IoSettings } from "react-icons/io5";
import { FaCalendar } from "react-icons/fa";

const urls = [
  {
    icon: <MdDashboard />,
    name: "Dashboard",
    link: "/dashboard",
  },
  {
    icon: <MdTravelExplore />,
    name: "Locations",
    link: "/dashboard/locations",
  },
  {
    icon: <MdLocationCity />,
    name: "Locations Requests",
    link: "/dashboard/location-requests",
  },
  {
    icon: <FaCalendar />,
    name: "Events",
    link: "/dashboard/events",
  },
  {
    icon: <MdApproval />,
    name: "Guide Approval",
    link: "/dashboard/guide-approval",
  },
  {
    icon: <MdAccountBox />,
    name: "Accounts",
    link: "/dashboard/accounts",
  },
  {
    icon: <MdOutlineFeedback />,
    name: "Received Feedback",
    link: "/dashboard/system-feedback",
  },
  {
    icon: <IoSettings />,
    name: "Settings",
    link: "/dashboard/settings",
  },
  {
    icon: <IoMdArrowRoundBack />,
    name: "Back To Home",
    link: "/",
  },
];

const AdminSideBar = () => {
  return <Sidebar urls={urls} />;
};

export default AdminSideBar;
