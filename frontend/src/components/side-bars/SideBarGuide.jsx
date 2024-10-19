import { MdDashboard, MdLocationCity, MdOutlineFeedback } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import Sidebar from "./SideBar";
import { IoSettings } from "react-icons/io5";
import { RiGuideFill } from "react-icons/ri";

const urls = [
  {
    icon: <MdDashboard />,
    name: "Dashboard",
    link: "/dashboard",
  },
  {
    icon: <MdLocationCity />,
    name: "Request Locations",
    link: "/dashboard/request-locations",
  },
  {
    icon: <RiGuideFill />,
    name: "Guide Requests",
    link: "/dashboard/guide-requests",
  },
  {
    icon: <MdOutlineFeedback />,
    name: "Received Feedback",
    link: "/dashboard/received-feedback",
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

const GuideSideBar = () => {
  return <Sidebar urls={urls} />;
};

export default GuideSideBar;
