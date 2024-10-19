import { MdTravelExplore } from "react-icons/md";
import { IoMdArrowRoundBack } from "react-icons/io";
import Sidebar from "./SideBar";
import { IoSettings } from "react-icons/io5";

const urls = [
  {
    icon: <MdTravelExplore />,
    name: "Travels",
    link: "/dashboard",
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

const TravelerSideBar = () => {
  return <Sidebar urls={urls} />;
};

export default TravelerSideBar;
