import GuideLocations from "@/components/guide/GuideLocations";
import SideBarForRole from "@/components/side-bars/SideBarForRole";
import { ROLES } from "@/data/roles";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RequestLocations = () => {
  const { user } = useSelector((state) => state.user);
  const { role, guide } = user;

  if (guide?.id === null || guide?.is_verified === 0) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="w-full">
      {/* sidebar */}
      <SideBarForRole />

      {/* main content */}
      <div className="flex w-full justify-center px-4 py-16 lg:ms-72 lg:w-[calc(100%_-_18rem)]">
        {ROLES.Guide === role && <GuideLocations />}
      </div>
    </div>
  );
};

export default RequestLocations;
