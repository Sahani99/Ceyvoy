import AdminReceivedFeedbacks from "@/components/admin/AdminReceivedFeedbacks";
import GuideReceivedFeedbacks from "@/components/guide/GuideReceivedFeedbacks";
import SideBarForRole from "@/components/side-bars/SideBarForRole";
import { ROLES } from "@/data/roles";
import { useSelector } from "react-redux";

const ReceivedFeedbacks = () => {
  const { user } = useSelector((state) => state.user);
  const { role } = user;

  return (
    <div className="w-full">
      {/* sidebar */}
      <SideBarForRole />

      {/* main content */}
      <div className="flex w-full justify-center px-4 py-16 lg:ms-72 lg:w-[calc(100%_-_18rem)]">
        {ROLES.Admin === role && <AdminReceivedFeedbacks />}
        {ROLES.Guide === role && <GuideReceivedFeedbacks />}
      </div>
    </div>
  );
};

export default ReceivedFeedbacks;
