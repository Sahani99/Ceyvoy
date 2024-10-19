import { useSelector } from "react-redux";
import TravelerSideBar from "./SideBarTraveler";
import GuideSideBar from "./SideBarGuide";
import AccommodationsSideBar from "./SideBarAccommodations";
import AdminSideBar from "./SideBarAdmin";
import { ROLES } from "@/data/roles";

const SideBarForRole = () => {
  const { user } = useSelector((state) => state.user);
  const { role } = user;
  if (role === ROLES.Traveler) return <TravelerSideBar />;
  if (role === ROLES.Guide) return <GuideSideBar />;
  if (role === ROLES.Accommodations) return <AccommodationsSideBar />;
  if (role === ROLES.Admin) return <AdminSideBar />;
  return null;
};

export default SideBarForRole;
