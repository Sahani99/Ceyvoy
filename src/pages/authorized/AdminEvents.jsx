import AdminEvents from "@/components/admin/AdminEvents";
import SideBarForRole from "@/components/side-bars/SideBarForRole";
import { ROLES } from "@/data/roles";
import { useSelector } from "react-redux";

const EventsAdmin = () => {
  const { user } = useSelector((state) => state.user);
  const { role } = user;

  return (
    <div className="w-full">
      {/* sidebar */}
      <SideBarForRole />

      {/* main content */}
      <div className="flex w-full justify-center px-4 py-16 lg:ms-72 lg:w-[calc(100%_-_18rem)]">
        {ROLES.Admin === role && <AdminEvents />}
      </div>
    </div>
  );
};

export default EventsAdmin;
