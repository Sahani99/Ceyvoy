import SideBarForRole from "@/components/side-bars/SideBarForRole";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROLES } from "@/data/roles";
import GuideRequests from "@/components/guide/GuideRequests";

const GuideTravelRequests = () => {
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
        {ROLES.Guide === role && <GuideRequests />}
      </div>
    </div>
  );
};

export default GuideTravelRequests;
