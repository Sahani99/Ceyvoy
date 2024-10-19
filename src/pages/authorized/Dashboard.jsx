import AccommodationAccommodations from "@/components/accommodations/AccommodationAccommodations";
import AdminStatistics from "@/components/admin/AdminStatistics";
import GuideDetails from "@/components/guide/GuideDetails";
import SideBarForRole from "@/components/side-bars/SideBarForRole";
import TravelerTrips from "@/components/traveler/TravelerTrips";
import { ROLES } from "@/data/roles";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);
  const { role } = user;

  return (
    <div className="w-full">
      {/* sidebar */}
      <SideBarForRole />

      {/* main content */}
      <div className="flex w-full justify-center px-4 py-16 lg:ms-72 lg:w-[calc(100%_-_18rem)]">
        {ROLES.Admin === role && <AdminStatistics />}
        {ROLES.Guide === role && <GuideDetails />}
        {ROLES.Accommodations === role && <AccommodationAccommodations />}
        {ROLES.Traveler === role && <TravelerTrips />}
      </div>
    </div>
  );
};

export default Dashboard;
